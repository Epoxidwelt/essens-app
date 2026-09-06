import type {
  Recipe,
  ShoppingList,
  ShoppingListItem,
  ShopCategory,
  Unit,
  WeeklyPlan,
} from '../types';
import { INGREDIENT_BY_ID, SHOP_CATEGORY_LABEL, SHOP_CATEGORY_ORDER } from '../data/ingredients';
import { formatQuantity, roundAmount, toBase, unitFamily } from './quantity';

/**
 * Einkaufslisten-Logik.
 *
 * Positionen werden immer in der Basiseinheit gespeichert (g / ml / TL / Stk ...).
 * Der Merge-Schluessel ist `ingredientId + Einheitenfamilie`; dadurch werden
 * "2 Zwiebeln" und "3 Zwiebeln" automatisch zu "5 Zwiebeln", waehrend
 * "200 g Tomaten" und "2 Stk Tomaten" korrekt getrennt bleiben.
 */

const key = (ingredientId: string, unit: Unit) => `${ingredientId}|${unitFamily(unit)}`;

function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export interface PendingItem {
  ingredientId: string;
  amount: number;
  unit: Unit;
  source?: { recipeId: string; servings: number };
  manual?: boolean;
}

/** Rechnet die Zutaten eines Rezeptes auf die gewuenschte Portionszahl um. */
export function recipeToPendingItems(recipe: Recipe, servings: number): PendingItem[] {
  const factor = servings / recipe.baseServings;
  return recipe.ingredients
    .filter((ri) => !ri.skipShopping && ri.ingredientId !== 'wasser')
    .map((ri) => {
      const scaled = ri.amount * factor;
      const base = toBase(scaled, ri.unit);
      return {
        ingredientId: ri.ingredientId,
        amount: base.amount,
        unit: base.unit,
        source: { recipeId: recipe.id, servings },
      };
    });
}

/** Fuegt Positionen hinzu und rechnet gleiche Zutaten zusammen. */
export function addItems(list: ShoppingList, pending: PendingItem[]): ShoppingList {
  const items = list.items.map((it) => ({ ...it, sources: [...it.sources] }));
  const index = new Map<string, ShoppingListItem>();
  for (const it of items) index.set(key(it.ingredientId, it.unit), it);

  for (const p of pending) {
    const base = toBase(p.amount, p.unit);
    const k = key(p.ingredientId, base.unit);
    const existing = index.get(k);
    if (existing) {
      existing.amount += base.amount;
      // Eine bereits abgehakte Position wird durch neue Mengen wieder aktiv.
      existing.checked = false;
      if (p.source) existing.sources.push(p.source);
    } else {
      const item: ShoppingListItem = {
        id: newId('sli'),
        ingredientId: p.ingredientId,
        amount: base.amount,
        unit: base.unit,
        checked: false,
        sources: p.source ? [p.source] : [],
        ...(p.manual ? { manual: true } : {}),
        createdAt: new Date().toISOString(),
      };
      items.push(item);
      index.set(k, item);
    }
  }

  return { ...list, items, updatedAt: new Date().toISOString() };
}

/** Fuegt ein komplettes Rezept zur Einkaufsliste hinzu. */
export function addRecipe(list: ShoppingList, recipe: Recipe, servings: number): ShoppingList {
  return addItems(list, recipeToPendingItems(recipe, servings));
}

/** Entfernt die Mengen eines Rezeptes wieder aus der Liste. */
export function removeRecipe(list: ShoppingList, recipeId: string): ShoppingList {
  const items: ShoppingListItem[] = [];
  for (const item of list.items) {
    const keep = item.sources.filter((s) => s.recipeId !== recipeId);
    if (keep.length === item.sources.length) {
      items.push(item);
      continue;
    }
    const removedShare = item.sources.length ? (item.sources.length - keep.length) / item.sources.length : 1;
    const remaining = item.amount * (1 - removedShare);
    if (keep.length === 0 && !item.manual) continue;
    if (remaining <= 0.0001) {
      if (item.manual) items.push({ ...item, sources: keep });
      continue;
    }
    items.push({ ...item, amount: remaining, sources: keep });
  }
  return { ...list, items, updatedAt: new Date().toISOString() };
}

/** Erzeugt aus allen Rezepten des Wochenplans eine zusammengefasste Einkaufsliste. */
export function pendingItemsFromPlan(
  plan: WeeklyPlan,
  recipeById: Record<string, Recipe>,
): PendingItem[] {
  const pending: PendingItem[] = [];
  for (const entry of plan.items) {
    const recipe = recipeById[entry.recipeId];
    if (!recipe) continue;
    pending.push(...recipeToPendingItems(recipe, entry.servings));
  }
  return pending;
}

export interface ShoppingGroup {
  category: ShopCategory;
  items: ShoppingListItem[];
}

/** Gruppiert die Liste nach Supermarkt-Abteilung, offene Positionen zuerst. */
export function groupByCategory(items: ShoppingListItem[]): ShoppingGroup[] {
  const groups = new Map<ShopCategory, ShoppingListItem[]>();
  for (const item of items) {
    const category = INGREDIENT_BY_ID[item.ingredientId]?.category ?? 'sonstiges';
    const bucket = groups.get(category) ?? [];
    bucket.push(item);
    groups.set(category, bucket);
  }
  return SHOP_CATEGORY_ORDER.filter((c) => groups.has(c)).map((category) => ({
    category,
    items: (groups.get(category) ?? []).sort((a, b) => {
      if (a.checked !== b.checked) return a.checked ? 1 : -1;
      const an = INGREDIENT_BY_ID[a.ingredientId]?.name ?? a.ingredientId;
      const bn = INGREDIENT_BY_ID[b.ingredientId]?.name ?? b.ingredientId;
      return an.localeCompare(bn, 'de');
    }),
  }));
}

/** Anzeigefertige Menge einer Position (gerundet). */
export function itemAmount(item: ShoppingListItem): { amount: number; unit: Unit } {
  return { amount: roundAmount(item.amount, item.unit), unit: item.unit };
}

/**
 * Einkaufsliste als Text – zum Teilen per Nachricht, damit auch jemand anderes
 * einkaufen gehen kann. Bereits abgehakte Positionen bleiben aussen vor.
 */
export function shoppingListToText(items: ShoppingListItem[]): string {
  const offen = items.filter((item) => !item.checked);
  if (offen.length === 0) return 'Einkaufsliste (Essens App)\n\nAlles erledigt.';

  const lines: string[] = ['Einkaufsliste (Essens App)', ''];
  for (const group of groupByCategory(offen)) {
    lines.push(SHOP_CATEGORY_LABEL[group.category]);
    for (const item of group.items) {
      const q = itemAmount(item);
      const name = INGREDIENT_BY_ID[item.ingredientId]?.name ?? item.ingredientId;
      lines.push(`- ${formatQuantity(q.amount, q.unit)} ${name}`);
    }
    lines.push('');
  }
  return lines.join('\n').trim();
}
