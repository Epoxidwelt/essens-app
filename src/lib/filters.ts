import type { Recipe } from '../types';

export interface FilterDef {
  id: string;
  label: string;
  /** favoriteIds wird fuer den Favoriten-Filter gebraucht. */
  test: (recipe: Recipe, favoriteIds: Set<string>) => boolean;
}

export const FILTERS: FilterDef[] = [
  { id: 'favoriten', label: '❤️ Favoriten', test: (r, favs) => favs.has(r.id) },
  { id: 'kinderfreundlich', label: '👨‍👩‍👧‍👦 Kinderfreundlich', test: (r) => r.kidFriendly },
  { id: 'one-pot', label: '🥘 One Pot', test: (r) => r.onePot },
  { id: 'haehnchen', label: '🍗 Hähnchen', test: (r) => r.categories.includes('haehnchen') },
  { id: 'hackfleisch', label: '🥩 Hackfleisch', test: (r) => r.categories.includes('hackfleisch') },
  { id: 'vegetarisch', label: '🌱 Vegetarisch', test: (r) => r.categories.includes('vegetarisch') },
  { id: 'unter-20', label: '⏱️ unter 20 Min', test: (r) => r.timeMinutes <= 20 },
  { id: 'unter-30', label: '⏱️ unter 30 Min', test: (r) => r.timeMinutes <= 30 },
  { id: 'proteinreich', label: '💪 Proteinreich', test: (r) => r.nutrition.protein >= 25 },
  { id: 'pasta', label: '🍝 Pasta', test: (r) => r.categories.includes('pasta') },
  { id: 'reis', label: '🍚 Reis', test: (r) => r.categories.includes('reis') },
  { id: 'kartoffeln', label: '🥔 Kartoffeln', test: (r) => r.categories.includes('kartoffeln') },
  { id: 'auflauf', label: '🧑‍🍳 Auflauf', test: (r) => r.categories.includes('auflauf') },
  { id: 'fruehstueck', label: '🥣 Frühstück', test: (r) => r.categories.includes('fruehstueck') },
];

const FILTER_BY_ID = Object.fromEntries(FILTERS.map((f) => [f.id, f]));

/** Textsuche ueber Name, Beschreibung und Kategorien. */
export function matchesQuery(recipe: Recipe, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    recipe.name,
    recipe.description,
    ...recipe.categories,
    ...(recipe.onePot ? ['one pot'] : []),
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
