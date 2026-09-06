import { describe, expect, it } from 'vitest';
import { RECIPES, RECIPE_BY_ID } from '../src/data/recipes';
import { INGREDIENT_BY_ID } from '../src/data/ingredients';
import { formatQuantity, roundAmount, scaleAmount } from '../src/lib/quantity';
import {
  addItems,
  addRecipe,
  groupByCategory,
  pendingItemsFromPlan,
  recipeToPendingItems,
  removeRecipe,
} from '../src/lib/shopping';
import { createInitialState, hydrate } from '../src/lib/storage';
import { filterRecipes } from '../src/lib/filters';
import { describeHousehold, plural } from '../src/lib/text';
import { createBackup, describeState, parseBackup } from '../src/lib/backup';
import { shoppingListToText } from '../src/lib/shopping';
import { sqlBool, sqlJson, sqlNumber, sqlText, sqlTextArray } from '../src/lib/sql';
import { mergeStates, sameContent } from '../src/lib/sync';
import { alleRezepte, findeRezept } from '../src/lib/recipes';
import type { ShoppingList, WeeklyPlan } from '../src/types';

const emptyList = (): ShoppingList => createInitialState().shoppingList;

describe('Rezeptdaten', () => {
  it('enthält 30 Rezepte, davon mindestens 15 One-Pot-Gerichte', () => {
    expect(RECIPES).toHaveLength(30);
    expect(RECIPES.filter((r) => r.onePot).length).toBeGreaterThanOrEqual(15);
  });

  it('ist durchgängig ohne zugesetzten Zucker und ohne Fisch', () => {
    const fischWorte = /(fisch|lachs|thunfisch|garnele|shrimp|scampi|kabeljau|forelle)/i;
    for (const recipe of RECIPES) {
      expect(recipe.noAddedSugar).toBe(true);
      const text = [recipe.name, recipe.description, ...recipe.steps].join(' ');
      expect(text).not.toMatch(fischWorte);
      for (const ri of recipe.ingredients) {
        expect(INGREDIENT_BY_ID[ri.ingredientId]?.name ?? '').not.toMatch(fischWorte);
      }
    }
  });

  it('verweist nur auf bekannte Zutaten und hat vollständige Angaben', () => {
    for (const recipe of RECIPES) {
      expect(recipe.ingredients.length).toBeGreaterThan(2);
      expect(recipe.steps.length).toBeGreaterThan(2);
      expect(recipe.baseServings).toBe(4);
      expect(recipe.nutrition.kcal).toBeGreaterThan(0);
      for (const ri of recipe.ingredients) {
        expect(INGREDIENT_BY_ID[ri.ingredientId], `unbekannte Zutat: ${ri.ingredientId}`).toBeDefined();
        expect(ri.amount).toBeGreaterThan(0);
      }
    }
  });

  it('hat eindeutige IDs', () => {
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length);
  });
});

describe('Portionsgrößen', () => {
  it('verdoppelt die Mengen bei doppelter Portionszahl', () => {
    expect(scaleAmount(400, 'g', 4, 8)).toBe(800);
    expect(scaleAmount(2, 'Stk', 4, 8)).toBe(4);
  });

  it('halbiert die Mengen korrekt', () => {
    expect(scaleAmount(400, 'g', 4, 2)).toBe(200);
    expect(scaleAmount(1, 'Stk', 4, 2)).toBe(0.5);
  });

  it('rundet auf küchentaugliche Werte', () => {
    expect(scaleAmount(300, 'g', 4, 3)).toBe(230); // 225 -> 230
    expect(roundAmount(0.33, 'Stk')).toBe(0.5);
    expect(roundAmount(1.2, 'Prise')).toBe(1);
  });

  it('formatiert Mengen menschenlesbar', () => {
    expect(formatQuantity(1500, 'g')).toBe('1,5 kg');
    expect(formatQuantity(0.5, 'Stk')).toBe('½ Stk');
    expect(formatQuantity(1.5, 'EL')).toBe('1½ EL');
    expect(formatQuantity(1000, 'ml')).toBe('1 l');
  });

  it('skaliert ein komplettes Rezept', () => {
    const recipe = RECIPE_BY_ID['one-pot-bolognese-nudeln'];
    const acht = recipeToPendingItems(recipe, 8);
    const hack = acht.find((p) => p.ingredientId === 'rinderhack');
    expect(hack?.amount).toBe(800);
  });
});

describe('Einkaufsliste – Zusammenrechnen', () => {
  it('addiert gleiche Zutaten aus verschiedenen Rezepten', () => {
    let list = emptyList();
    list = addItems(list, [{ ingredientId: 'zwiebel', amount: 2, unit: 'Stk' }]);
    list = addItems(list, [{ ingredientId: 'zwiebel', amount: 3, unit: 'Stk' }]);
    const zwiebeln = list.items.filter((i) => i.ingredientId === 'zwiebel');
    expect(zwiebeln).toHaveLength(1);
    expect(zwiebeln[0].amount).toBe(5);
  });

  it('rechnet unterschiedliche Einheiten derselben Familie um', () => {
    let list = emptyList();
    list = addItems(list, [{ ingredientId: 'kartoffel', amount: 200, unit: 'g' }]);
    list = addItems(list, [{ ingredientId: 'kartoffel', amount: 0.5, unit: 'kg' }]);
    expect(list.items).toHaveLength(1);
    expect(list.items[0].amount).toBe(700);
    expect(formatQuantity(list.items[0].amount, list.items[0].unit)).toBe('700 g');
  });

  it('rechnet EL und TL zusammen', () => {
    let list = emptyList();
    list = addItems(list, [{ ingredientId: 'olivenoel', amount: 2, unit: 'EL' }]);
    list = addItems(list, [{ ingredientId: 'olivenoel', amount: 3, unit: 'TL' }]);
    expect(list.items).toHaveLength(1);
    expect(list.items[0].amount).toBe(9); // 6 TL + 3 TL
    expect(formatQuantity(9, 'TL')).toBe('3 EL');
  });

  it('hält verschiedene Zutaten getrennt', () => {
    let list = emptyList();
    list = addItems(list, [{ ingredientId: 'zwiebel', amount: 2, unit: 'Stk' }]);
    list = addItems(list, [{ ingredientId: 'knoblauch', amount: 2, unit: 'Zehe' }]);
    expect(list.items).toHaveLength(2);
  });

  it('übernimmt alle Zutaten eines Rezeptes außer Wasser', () => {
    const recipe = RECIPE_BY_ID['one-pot-bolognese-nudeln'];
    const list = addRecipe(emptyList(), recipe, 4);
    expect(list.items.some((i) => i.ingredientId === 'wasser')).toBe(false);
    expect(list.items).toHaveLength(recipe.ingredients.length - 1);
  });

  it('aktiviert eine abgehakte Position wieder, wenn Menge dazukommt', () => {
    let list = addItems(emptyList(), [{ ingredientId: 'zwiebel', amount: 2, unit: 'Stk' }]);
    list = { ...list, items: list.items.map((i) => ({ ...i, checked: true })) };
    list = addItems(list, [{ ingredientId: 'zwiebel', amount: 1, unit: 'Stk' }]);
    expect(list.items[0].checked).toBe(false);
    expect(list.items[0].amount).toBe(3);
  });

  it('entfernt die Mengen eines Rezeptes wieder', () => {
    const a = RECIPE_BY_ID['one-pot-bolognese-nudeln'];
    const b = RECIPE_BY_ID['one-pot-kartoffelgulasch'];
    let list = addRecipe(emptyList(), a, 4);
    list = addRecipe(list, b, 4);
    const zwiebelVorher = list.items.find((i) => i.ingredientId === 'zwiebel')!.amount;
    expect(zwiebelVorher).toBe(3); // 1 aus Bolognese + 2 aus Gulasch
    list = removeRecipe(list, b.id);
    expect(list.items.find((i) => i.ingredientId === 'zwiebel')!.amount).toBeCloseTo(1.5, 5);
    expect(list.items.some((i) => i.ingredientId === 'kartoffel')).toBe(false);
  });

  it('gruppiert nach Supermarkt-Abteilung', () => {
    const list = addRecipe(emptyList(), RECIPE_BY_ID['one-pot-bolognese-nudeln'], 4);
    const groups = groupByCategory(list.items);
    const categories = groups.map((g) => g.category);
    expect(categories[0]).toBe('obst-gemuese');
    expect(categories).toContain('fleisch');
    expect(categories).toContain('getreide');
  });
});

describe('Wochenplan', () => {
  const plan: WeeklyPlan = {
    id: 'p',
    userId: 'u',
    weekStart: '2026-09-07',
    items: [
      { id: '1', day: 'mo', slot: 'abend', recipeId: 'one-pot-bolognese-nudeln', servings: 4 },
      { id: '2', day: 'di', slot: 'abend', recipeId: 'one-pot-kartoffelgulasch', servings: 4 },
      { id: '3', day: 'mi', slot: 'abend', recipeId: 'one-pot-bolognese-nudeln', servings: 8 },
    ],
  };

  it('erstellt aus allen Rezepten der Woche eine zusammengeführte Liste', () => {
    const pending = pendingItemsFromPlan(plan, RECIPE_BY_ID);
    const list = addItems(emptyList(), pending);
    // Zwiebeln: 1 (Bolognese 4P) + 2 (Gulasch) + 2 (Bolognese 8P) = 5
    expect(list.items.find((i) => i.ingredientId === 'zwiebel')!.amount).toBe(5);
    // Rinderhack: 400 g + 800 g = 1200 g
    expect(list.items.find((i) => i.ingredientId === 'rinderhack')!.amount).toBe(1200);
    // jede Zutat kommt nur einmal vor
    const keys = list.items.map((i) => `${i.ingredientId}|${i.unit}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('Filter & Suche', () => {
  it('filtert One-Pot-Gerichte unter 30 Minuten', () => {
    const result = filterRecipes(RECIPES, { activeFilters: ['one-pot', 'unter-30'] });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((r) => r.onePot && r.timeMinutes <= 30)).toBe(true);
  });

  it('berücksichtigt Favoriten', () => {
    const favs = new Set(['one-pot-bolognese-nudeln']);
    const result = filterRecipes(RECIPES, { activeFilters: ['favoriten'], favoriteIds: favs });
    expect(result.map((r) => r.id)).toEqual(['one-pot-bolognese-nudeln']);
  });

  it('findet Rezepte per Textsuche', () => {
    expect(filterRecipes(RECIPES, { query: 'brokkoli' }).length).toBeGreaterThan(0);
    expect(filterRecipes(RECIPES, { query: 'pizza' })).toHaveLength(0);
  });
});

describe('Speicherung', () => {
  it('ergänzt fehlende Felder aus älteren Ständen', () => {
    const restored = hydrate({
      user: { id: 'local-user', name: 'Familie', household: { adults: 2, kids: 2 }, defaultServings: 4 },
      favorites: [{ userId: 'local-user', recipeId: 'one-pot-bolognese-nudeln', createdAt: 'x' }],
      ratings: [],
      // absichtlich unvollständig, wie ein alter Stand
    } as never);
    expect(restored.favorites).toHaveLength(1);
    expect(restored.shoppingList.items).toEqual([]);
    expect(restored.weeklyPlan.items).toEqual([]);
  });
});

describe('Texte', () => {
  it('bildet den Singular korrekt', () => {
    expect(plural(1, 'Rezept', 'Rezepte')).toBe('1 Rezept');
    expect(plural(0, 'Rezept', 'Rezepte')).toBe('0 Rezepte');
    expect(plural(3, 'Mahlzeit', 'Mahlzeiten')).toBe('3 Mahlzeiten');
  });
});

describe('Haushalt', () => {
  it('beschreibt die Familie sprachlich korrekt', () => {
    expect(describeHousehold(2, 2)).toBe('2 Erwachsene + 2 Kinder');
    expect(describeHousehold(1, 1)).toBe('1 Erwachsener + 1 Kind');
    expect(describeHousehold(2, 0)).toBe('2 Erwachsene');
  });
});

describe('Einkaufsliste teilen', () => {
  it('erzeugt lesbaren Text nach Abteilungen und lässt Abgehaktes weg', () => {
    let list = addRecipe(emptyList(), RECIPE_BY_ID['one-pot-bolognese-nudeln'], 4);
    list = {
      ...list,
      items: list.items.map((i) => (i.ingredientId === 'zwiebel' ? { ...i, checked: true } : i)),
    };
    const text = shoppingListToText(list.items);
    expect(text).toContain('🥩 Fleisch');
    expect(text).toContain('- 400 g Rinderhackfleisch');
    expect(text).not.toContain('Zwiebel');
  });

  it('meldet eine leere Liste', () => {
    expect(shoppingListToText([])).toContain('Alles erledigt.');
  });
});

describe('Datensicherung', () => {
  it('exportiert und liest denselben Stand wieder ein', () => {
    const state = createInitialState();
    state.favorites.push({ userId: 'local-user', recipeId: 'one-pot-bolognese-nudeln', createdAt: 'x' });
    const text = JSON.stringify(createBackup(state));
    const restored = parseBackup(text);
    expect(restored.favorites).toHaveLength(1);
    expect(restored.favorites[0].recipeId).toBe('one-pot-bolognese-nudeln');
  });

  it('fasst den Stand sprachlich korrekt zusammen', () => {
    const state = createInitialState();
    state.favorites.push({ userId: 'local-user', recipeId: 'one-pot-bolognese-nudeln', createdAt: 'x' });
    expect(describeState(state)).toContain('1 Favorit ·');
    expect(describeState(state)).toContain('0 Bewertungen');
  });

  it('weist fremde oder kaputte Dateien mit klarer Meldung ab', () => {
    expect(() => parseBackup('kein json')).toThrow(/kein lesbares JSON/);
    expect(() => parseBackup('{"app":"andere-app"}')).toThrow(/nicht aus der Essens App/);
    expect(() => parseBackup(JSON.stringify({ app: 'essens-app', version: 99, state: {} }))).toThrow(
      /neueren App-Version/,
    );
  });
});

describe('SQL-Erzeugung für die Datenbank', () => {
  it('maskiert Apostrophe, damit die Anweisung nicht abbricht', () => {
    expect(sqlText("Oma's Auflauf")).toBe("'Oma''s Auflauf'");
    expect(sqlText("'; drop table recipes; --")).toBe("'''; drop table recipes; --'");
  });

  it('schreibt fehlende Werte als NULL', () => {
    expect(sqlText(undefined)).toBe('null');
    expect(sqlText(null)).toBe('null');
  });

  it('erzeugt gültige Listen, Zahlen und JSON', () => {
    expect(sqlBool(true)).toBe('true');
    expect(sqlNumber(1.5)).toBe('1.5');
    expect(() => sqlNumber(Number.NaN)).toThrow(/Ungültige Zahl/);
    expect(sqlTextArray(['one-pot', 'pasta'])).toBe("array['one-pot', 'pasta']::text[]");
    expect(sqlJson(['Schritt eins'])).toBe('\'["Schritt eins"]\'::jsonb');
  });
});

describe('Abgleich zwischen zwei Geräten', () => {
  /** Baut einen Stand mit den übergebenen Änderungen. */
  const stand = (aenderung: (s: ReturnType<typeof createInitialState>) => void) => {
    const s = createInitialState();
    aenderung(s);
    return s;
  };

  it('behält Favoriten von beiden Geräten', () => {
    const handy = stand((s) => {
      s.favorites.push({ userId: 'u', recipeId: 'one-pot-bolognese-nudeln', createdAt: '2026-09-01' });
    });
    const tablet = stand((s) => {
      s.favorites.push({ userId: 'u', recipeId: 'one-pot-chili-sin-carne', createdAt: '2026-09-02' });
    });
    const merged = mergeStates(handy, tablet);
    expect(merged.favorites.map((f) => f.recipeId).sort()).toEqual([
      'one-pot-bolognese-nudeln',
      'one-pot-chili-sin-carne',
    ]);
  });

  it('verliert keine Bewertungen', () => {
    const a = stand((s) => {
      s.ratings.push({ id: 'r1', userId: 'u', recipeId: 'x', stars: 5, kidsLiked: true, createdAt: '2026-09-01' });
    });
    const b = stand((s) => {
      s.ratings.push({ id: 'r2', userId: 'u', recipeId: 'y', stars: 3, kidsLiked: null, createdAt: '2026-09-02' });
    });
    expect(mergeStates(a, b).ratings).toHaveLength(2);
    // Derselbe Eintrag zählt nur einmal.
    expect(mergeStates(a, a).ratings).toHaveLength(1);
  });

  it('führt die Einkaufsliste zusammen: abgehakt gewinnt, größere Menge gewinnt', () => {
    const imLaden = addRecipe(emptyList(), RECIPE_BY_ID['one-pot-bolognese-nudeln'], 4);
    const zuHause = addRecipe(emptyList(), RECIPE_BY_ID['one-pot-bolognese-nudeln'], 8);

    const handy = stand((s) => {
      // Im Supermarkt Zwiebeln abgehakt
      s.shoppingList = {
        ...imLaden,
        items: imLaden.items.map((i) => (i.ingredientId === 'zwiebel' ? { ...i, checked: true } : i)),
      };
    });
    const tablet = stand((s) => {
      s.shoppingList = zuHause;
    });

    const merged = mergeStates(handy, tablet);
    const zwiebel = merged.shoppingList.items.find((i) => i.ingredientId === 'zwiebel')!;
    const hack = merged.shoppingList.items.find((i) => i.ingredientId === 'rinderhack')!;

    expect(zwiebel.checked).toBe(true); // liegt schon im Einkaufswagen
    expect(zwiebel.amount).toBe(2); // die größere der beiden Mengen
    expect(hack.amount).toBe(800);
    // Keine doppelten Positionen
    const keys = merged.shoppingList.items.map((i) => `${i.ingredientId}|${i.unit}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('belegt jeden Wochenplan-Platz nur einmal, der eigene Eintrag gewinnt', () => {
    const meins = stand((s) => {
      s.weeklyPlan.items.push({ id: 'a', day: 'mo', slot: 'abend', recipeId: 'one-pot-chili-sin-carne', servings: 4 });
    });
    const fremd = stand((s) => {
      s.weeklyPlan.items.push({ id: 'b', day: 'mo', slot: 'abend', recipeId: 'one-pot-bolognese-nudeln', servings: 4 });
      s.weeklyPlan.items.push({ id: 'c', day: 'di', slot: 'abend', recipeId: 'one-pot-bolognese-nudeln', servings: 4 });
    });
    const merged = mergeStates(meins, fremd);
    expect(merged.weeklyPlan.items).toHaveLength(2);
    expect(merged.weeklyPlan.items.find((i) => i.day === 'mo')!.recipeId).toBe('one-pot-chili-sin-carne');
    expect(merged.weeklyPlan.items.find((i) => i.day === 'di')!.recipeId).toBe('one-pot-bolognese-nudeln');
  });

  it('vermischt keine Pläne aus verschiedenen Wochen', () => {
    const dieseWoche = stand((s) => {
      s.weeklyPlan.weekStart = '2026-09-07';
      s.weeklyPlan.items.push({ id: 'a', day: 'mo', slot: 'abend', recipeId: 'one-pot-chili-sin-carne', servings: 4 });
    });
    const letzteWoche = stand((s) => {
      s.weeklyPlan.weekStart = '2026-08-31';
      s.weeklyPlan.items.push({ id: 'b', day: 'fr', slot: 'abend', recipeId: 'one-pot-bolognese-nudeln', servings: 4 });
    });
    expect(mergeStates(dieseWoche, letzteWoche).weeklyPlan.items).toHaveLength(1);
  });

  it('ist mehrfach anwendbar, ohne sich zu verändern', () => {
    const a = stand((s) => {
      s.favorites.push({ userId: 'u', recipeId: 'one-pot-bolognese-nudeln', createdAt: '2026-09-01' });
      s.shoppingList = addRecipe(emptyList(), RECIPE_BY_ID['one-pot-kartoffelgulasch'], 4);
    });
    const b = stand((s) => {
      s.shoppingList = addRecipe(emptyList(), RECIPE_BY_ID['one-pot-bolognese-nudeln'], 4);
    });
    const einmal = mergeStates(a, b);
    const zweimal = mergeStates(einmal, b);
    expect(zweimal.shoppingList.items).toHaveLength(einmal.shoppingList.items.length);
    expect(zweimal.favorites).toHaveLength(einmal.favorites.length);
  });
});

describe('Abgleich erkennt, wann nichts Neues dazukommt', () => {
  it('meldet gleichen Inhalt trotz neuer Zeitstempel', () => {
    const a = createInitialState();
    a.favorites.push({ userId: 'u', recipeId: 'one-pot-bolognese-nudeln', createdAt: '2026-09-01' });
    // Fester alter Zeitstempel, damit der Test nicht von der Uhr abhängt.
    a.shoppingList.updatedAt = '2020-01-01T00:00:00.000Z';
    const b = mergeStates(a, a);
    // updatedAt ändert sich beim Zusammenführen – der Inhalt aber nicht.
    expect(b.shoppingList.updatedAt).not.toBe(a.shoppingList.updatedAt);
    expect(sameContent(a, b)).toBe(true);
  });

  it('erkennt einen echten Unterschied', () => {
    const a = createInitialState();
    const b = createInitialState();
    b.favorites.push({ userId: 'u', recipeId: 'one-pot-chili-sin-carne', createdAt: '2026-09-01' });
    expect(sameContent(a, b)).toBe(false);
  });

  it('konvergiert: nach zwei Runden wissen beide Geräte dasselbe', () => {
    // Beide haben offline je einen eigenen Favoriten gesetzt.
    let handy = createInitialState();
    handy.favorites.push({ userId: 'u', recipeId: 'one-pot-linsen-kokos-curry', createdAt: '2026-09-01' });
    let tablet = createInitialState();
    tablet.favorites.push({ userId: 'u', recipeId: 'one-pot-brokkoli-nudeln', createdAt: '2026-09-01' });

    // Handy sendet, Tablet holt und sendet zurück, Handy holt erneut.
    let server = handy;
    tablet = mergeStates(tablet, server);
    server = tablet;
    handy = mergeStates(handy, server);

    expect(handy.favorites.map((f) => f.recipeId).sort()).toEqual([
      'one-pot-brokkoli-nudeln',
      'one-pot-linsen-kokos-curry',
    ]);
    expect(sameContent(handy, tablet)).toBe(true);
    // Ein weiterer Durchlauf ändert nichts mehr – kein endloses Hin und Her.
    expect(sameContent(handy, mergeStates(handy, tablet))).toBe(true);
  });
});

describe('Eigene Rezepte im Abgleich', () => {
  const eigenesRezept = (id: string, name: string, createdAt: string): import('../src/types').Recipe => ({
    id,
    name,
    description: '',
    placeholder: { emoji: '🍽️', tone: 'green' },
    baseServings: 4,
    timeMinutes: 20,
    difficulty: 'einfach',
    ingredients: [],
    steps: [],
    nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    categories: [],
    noAddedSugar: true,
    kidFriendly: true,
    onePot: false,
    createdAt,
    updatedAt: createdAt,
  });

  it('behält eigene Rezepte von beiden Geräten', () => {
    const handy = createInitialState();
    handy.customRecipes.push(eigenesRezept('a', 'Omas Auflauf', '2026-09-01'));
    const tablet = createInitialState();
    tablet.customRecipes.push(eigenesRezept('b', 'Papas Suppe', '2026-09-02'));

    const merged = mergeStates(handy, tablet);
    expect(merged.customRecipes.map((r) => r.id).sort()).toEqual(['a', 'b']);
  });

  it('behält bei einer bearbeiteten Version die neuere', () => {
    const alt = createInitialState();
    alt.customRecipes.push(eigenesRezept('a', 'Auflauf', '2026-09-01'));
    const neu = createInitialState();
    neu.customRecipes.push({ ...eigenesRezept('a', 'Auflauf (überarbeitet)', '2026-09-01'), updatedAt: '2026-09-05' });

    expect(mergeStates(alt, neu).customRecipes[0].name).toBe('Auflauf (überarbeitet)');
    expect(mergeStates(neu, alt).customRecipes[0].name).toBe('Auflauf (überarbeitet)');
  });

  it('führt dabei neu angelegte Zutaten zusammen', () => {
    const a = createInitialState();
    a.customIngredients.push({ id: 'eigene-tofu', name: 'Tofu', category: 'sonstiges' });
    const b = createInitialState();
    b.customIngredients.push({ id: 'eigene-seitan', name: 'Seitan', category: 'sonstiges' });
    expect(mergeStates(a, b).customIngredients.map((i) => i.id).sort()).toEqual([
      'eigene-seitan',
      'eigene-tofu',
    ]);
  });
});

describe('Kombinierte Rezeptliste (eingebaut + eigene)', () => {
  it('zeigt eigene Rezepte zusätzlich zu den eingebauten', () => {
    const eigenes = {
      id: 'eigenes-test',
      name: 'Test',
      description: '',
      placeholder: { emoji: '🍽️', tone: 'green' as const },
      baseServings: 4,
      timeMinutes: 10,
      difficulty: 'einfach' as const,
      ingredients: [],
      steps: [],
      nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
      categories: [],
      noAddedSugar: true,
      kidFriendly: true,
      onePot: false,
    };
    const alle = alleRezepte([eigenes]);
    expect(alle).toHaveLength(RECIPES.length + 1);
    expect(findeRezept('eigenes-test', [eigenes])?.name).toBe('Test');
    expect(findeRezept('one-pot-bolognese-nudeln', [eigenes])?.name).toBe('One-Pot Nudeln Bolognese');
    expect(findeRezept('gibt-es-nicht', [eigenes])).toBeUndefined();
  });
});
