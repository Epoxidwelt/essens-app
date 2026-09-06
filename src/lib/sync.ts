import type { AppState, Favorite, Rating, ShoppingListItem, WeeklyPlanItem } from '../types';
import { unitFamily } from './quantity';

/**
 * Abgleich zwischen mehreren Geraeten.
 *
 * Es gibt keinen zentralen Cloud-Dienst: Der Familien-Server (server/serve.mjs)
 * laeuft im eigenen Netz und haelt einen gemeinsamen Stand. Weil zwei Geraete
 * gleichzeitig etwas aendern koennen, werden Staende nicht einfach ueberschrieben,
 * sondern nach klaren Regeln zusammengefuehrt:
 *
 *  - Favoriten und Bewertungen: beide Seiten behalten (nie verlieren)
 *  - Einkaufsliste: gleiche Zutat wird zusammengefuehrt; abgehakt schlaegt offen
 *    (wer es im Laden abgehakt hat, hat es im Wagen)
 *  - Wochenplan: je Tag und Mahlzeit gewinnt der eigene, zuletzt geaenderte Eintrag
 *
 * Bewusste Einschraenkung: Loeschungen koennen wieder auftauchen, wenn das andere
 * Geraet den Eintrag zeitgleich noch kannte. Das ist der Preis dafuer, dass
 * niemals versehentlich Daten verschwinden.
 */

const itemKey = (item: ShoppingListItem) => `${item.ingredientId}|${unitFamily(item.unit)}`;
const slotKey = (item: WeeklyPlanItem) => `${item.day}|${item.slot}`;

/** Aeltestes createdAt gewinnt – so bleibt sichtbar, seit wann etwas Favorit ist. */
function mergeFavorites(mine: Favorite[], theirs: Favorite[]): Favorite[] {
  const byRecipe = new Map<string, Favorite>();
  for (const fav of [...theirs, ...mine]) {
    const existing = byRecipe.get(fav.recipeId);
    if (!existing || fav.createdAt < existing.createdAt) byRecipe.set(fav.recipeId, fav);
  }
  return [...byRecipe.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** Bewertungen werden nur ergaenzt, nie ersetzt. */
function mergeRatings(mine: Rating[], theirs: Rating[]): Rating[] {
  const byId = new Map<string, Rating>();
  for (const rating of [...theirs, ...mine]) byId.set(rating.id, rating);
  return [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function mergeShoppingItems(mine: ShoppingListItem[], theirs: ShoppingListItem[]): ShoppingListItem[] {
  const merged = new Map<string, ShoppingListItem>();

  for (const item of theirs) merged.set(itemKey(item), { ...item, sources: [...item.sources] });

  for (const item of mine) {
    const key = itemKey(item);
    const other = merged.get(key);
    if (!other) {
      merged.set(key, { ...item, sources: [...item.sources] });
      continue;
    }
    // Herkunftsangaben zusammenfuehren, ohne Dubletten.
    const sources = [...other.sources];
    for (const source of item.sources) {
      if (!sources.some((s) => s.recipeId === source.recipeId && s.servings === source.servings)) {
        sources.push(source);
      }
    }
    merged.set(key, {
      ...other,
      // Die groessere Menge gewinnt: lieber einmal zu viel kaufen als zu wenig.
      amount: Math.max(item.amount, other.amount),
      // Abgehakt gewinnt: das Teil liegt bereits im Einkaufswagen.
      checked: item.checked || other.checked,
      manual: item.manual || other.manual,
      sources,
      createdAt: item.createdAt < other.createdAt ? item.createdAt : other.createdAt,
    });
  }

  return [...merged.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** Je Tag und Mahlzeit gibt es genau ein Rezept – der eigene Eintrag gewinnt. */
function mergePlanItems(mine: WeeklyPlanItem[], theirs: WeeklyPlanItem[]): WeeklyPlanItem[] {
  const bySlot = new Map<string, WeeklyPlanItem>();
  for (const item of theirs) bySlot.set(slotKey(item), item);
  for (const item of mine) bySlot.set(slotKey(item), item);
  return [...bySlot.values()];
}

/**
 * Fuehrt den eigenen Stand (`mine`) mit dem Stand des Servers (`theirs`) zusammen.
 * Das Ergebnis enthaelt alles, was auf einer der beiden Seiten vorhanden war.
 */
export function mergeStates(mine: AppState, theirs: AppState): AppState {
  return {
    // Einstellungen: der eigene Stand gilt, das Geraet gehoert der Person davor.
    user: mine.user,
    favorites: mergeFavorites(mine.favorites, theirs.favorites),
    ratings: mergeRatings(mine.ratings, theirs.ratings),
    shoppingList: {
      ...mine.shoppingList,
      items: mergeShoppingItems(mine.shoppingList.items, theirs.shoppingList.items),
      updatedAt: new Date().toISOString(),
    },
    weeklyPlan:
      // Plaene verschiedener Wochen werden nicht vermischt.
      mine.weeklyPlan.weekStart === theirs.weeklyPlan.weekStart
        ? { ...mine.weeklyPlan, items: mergePlanItems(mine.weeklyPlan.items, theirs.weeklyPlan.items) }
        : mine.weeklyPlan,
  };
}

/**
 * Vergleicht zwei Staende inhaltlich.
 *
 * Wird gebraucht, damit ein Abgleich, der nichts Neues bringt, nicht als
 * Aenderung gilt – sonst wuerden sich zwei Geraete gegenseitig endlos
 * neue Versionen zuschicken. `updatedAt` bleibt bewusst aussen vor, weil es
 * sich bei jedem Zusammenfuehren aendert.
 */
export function sameContent(a: AppState, b: AppState): boolean {
  const relevant = (s: AppState) =>
    JSON.stringify({
      favorites: [...s.favorites].sort((x, y) => x.recipeId.localeCompare(y.recipeId)),
      ratings: [...s.ratings].sort((x, y) => x.id.localeCompare(y.id)),
      items: [...s.shoppingList.items].sort((x, y) => x.id.localeCompare(y.id)),
      plan: [...s.weeklyPlan.items].sort((x, y) => x.id.localeCompare(y.id)),
      week: s.weeklyPlan.weekStart,
      user: s.user,
    });
  return relevant(a) === relevant(b);
}
