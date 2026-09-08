import type { Recipe } from '../types';
import { INGREDIENT_BY_ID } from '../data/ingredients';

/**
 * Rubriken der App.
 *
 * Jede Rubrik ist eine Kachel auf der Rezeptseite. Sie tragen absichtlich
 * kurze Namen: Die Kachel soll man im Vorbeigehen treffen koennen.
 */

export type FilterGruppe = 'ernaehrung' | 'anlass' | 'zutat';

export interface FilterDef {
  id: string;
  /** Emoji der Kachel. */
  emoji: string;
  /** Kurzer Name auf der Kachel. */
  name: string;
  /** Emoji + Name – fuer Fliesstext und Chips. */
  label: string;
  gruppe: FilterGruppe;
  /** Eine Zeile Erklaerung, wo der Name allein missverstaendlich waere. */
  hinweis?: string;
  /** favoriteIds wird fuer den Favoriten-Filter gebraucht. */
  test: (recipe: Recipe, favoriteIds: Set<string>) => boolean;
}

export const FILTER_GRUPPEN: Array<{ id: FilterGruppe; titel: string }> = [
  { id: 'ernaehrung', titel: 'Ernährung' },
  { id: 'anlass', titel: 'Wann und wie' },
  { id: 'zutat', titel: 'Hauptzutat' },
];

/**
 * Alle Rezepte der App sind ohne *zugesetzten* Zucker – das ist ihre
 * Grundbedingung, kein Unterscheidungsmerkmal. Diese Rubrik trennt darum die
 * Gerichte ab, die auch keine suesse Zutat enthalten, also kein Obst und kein
 * Obstmus. Genau das meint man im Alltag mit "ganz ohne Zucker".
 */
export function istOhneSuesse(recipe: Recipe): boolean {
  return !recipe.ingredients.some((ri) => INGREDIENT_BY_ID[ri.ingredientId]?.sweet);
}

const f = (
  id: string,
  emoji: string,
  name: string,
  gruppe: FilterGruppe,
  test: FilterDef['test'],
  hinweis?: string,
): FilterDef => ({ id, emoji, name, label: `${emoji} ${name}`, gruppe, test, ...(hinweis ? { hinweis } : {}) });

export const FILTERS: FilterDef[] = [
  // --- Ernaehrung ---
  f('zuckerfrei', '🍬', 'Zuckerfrei', 'ernaehrung', (r) => istOhneSuesse(r), 'auch ohne Obst'),
  f('glutenfrei', '🌾', 'Glutenfrei', 'ernaehrung', (r) => r.glutenFree === true, 'Zutaten geprüft'),
  f('vegetarisch', '🌱', 'Vegetarisch', 'ernaehrung', (r) => r.categories.includes('vegetarisch')),
  // Absichtlich an der Kategorie, nicht am Feld kidFriendly: Das ist bei allen
  // 89 Rezepten true (die App kocht nur Familienessen) und taugt deshalb nicht
  // zum Filtern. "kinderliebling" meint die erklaerten Lieblingsgerichte.
  f('kinderfreundlich', '👨‍👩‍👧‍👦', 'Für Kinder', 'ernaehrung',
    (r) => r.categories.includes('kinderliebling'), 'erklärte Lieblinge'),
  f('proteinreich', '💪', 'Proteinreich', 'ernaehrung', (r) => r.nutrition.protein >= 25, 'ab 25 g je Portion'),

  // --- Anlass ---
  f('fruehstueck', '🥣', 'Frühstück', 'anlass', (r) => r.categories.includes('fruehstueck')),
  f('unter-20', '⏱️', 'Unter 20 Min', 'anlass', (r) => r.timeMinutes <= 20),
  f('unter-30', '🕧', 'Unter 30 Min', 'anlass', (r) => r.timeMinutes <= 30),
  f('one-pot', '🥘', 'One Pot', 'anlass', (r) => r.onePot, 'nur ein Topf'),
  f('suppe-eintopf', '🍲', 'Suppe & Eintopf', 'anlass', (r) => r.categories.includes('suppe-eintopf')),
  f('ofen', '🔥', 'Aus dem Ofen', 'anlass', (r) => r.categories.includes('ofen') || r.categories.includes('auflauf')),
  f('favoriten', '❤️', 'Favoriten', 'anlass', (r, favs) => favs.has(r.id)),

  // --- Hauptzutat ---
  f('haehnchen', '🍗', 'Hähnchen', 'zutat', (r) => r.categories.includes('haehnchen')),
  f('hackfleisch', '🥩', 'Hackfleisch', 'zutat', (r) => r.categories.includes('hackfleisch')),
  f('pasta', '🍝', 'Pasta', 'zutat', (r) => r.categories.includes('pasta')),
  f('reis', '🍚', 'Reis', 'zutat', (r) => r.categories.includes('reis')),
  f('kartoffeln', '🥔', 'Kartoffeln', 'zutat', (r) => r.categories.includes('kartoffeln')),
];

const FILTER_BY_ID = Object.fromEntries(FILTERS.map((x) => [x.id, x]));

export function findeFilter(id: string): FilterDef | undefined {
  return FILTER_BY_ID[id];
}

/** Textsuche ueber Name, Beschreibung und Kategorien. */
export function matchesQuery(recipe: Recipe, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    recipe.name,
    recipe.description,
    ...recipe.categories,
    ...(recipe.onePot ? ['one pot'] : []),
    ...(recipe.glutenFree ? ['glutenfrei', 'gluten'] : []),
    ...(istOhneSuesse(recipe) ? ['zuckerfrei'] : []),
  ]
    .join(' ')
    .toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

/** Aktive Filter werden UND-verknuepft. */
export function filterRecipes(
  recipes: Recipe[],
  options: { query?: string; activeFilters?: string[]; favoriteIds?: Set<string> },
): Recipe[] {
  const { query = '', activeFilters = [], favoriteIds = new Set<string>() } = options;
  return recipes.filter((recipe) => {
    if (!matchesQuery(recipe, query)) return false;
    return activeFilters.every((id) => FILTER_BY_ID[id]?.test(recipe, favoriteIds) ?? true);
  });
}

/** Wie viele Rezepte eine Rubrik zusammen mit der aktuellen Auswahl noch liefert. */
export function trefferProFilter(
  recipes: Recipe[],
  options: { query?: string; activeFilters?: string[]; favoriteIds?: Set<string> },
): Record<string, number> {
  const { activeFilters = [], favoriteIds = new Set<string>() } = options;
  const zaehler: Record<string, number> = {};
  for (const def of FILTERS) {
    const kombiniert = activeFilters.includes(def.id)
      ? activeFilters
      : [...activeFilters, def.id];
    zaehler[def.id] = filterRecipes(recipes, { ...options, activeFilters: kombiniert, favoriteIds }).length;
  }
  return zaehler;
}
