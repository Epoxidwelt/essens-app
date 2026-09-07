import { describe, expect, it } from 'vitest';
import { RECIPES } from '../src/data/recipes';
import { INGREDIENT_BY_ID } from '../src/data/ingredients';
import { filterRecipes } from '../src/lib/filters';

/**
 * Das Haekchen "glutenfrei" ist eine Zusage an jemanden, der sie ernst nehmen
 * muss. Diese Tests halten sie ehrlich: Sie pruefen nicht, ob die Kennzeichnung
 * gesetzt ist, sondern ob sie zu den tatsaechlichen Zutaten passt.
 */

/** Zutaten, die Gluten enthalten oder ueblicherweise damit verunreinigt sind. */
const GLUTENHALTIG = [
  'nudeln',
  'vollkornnudeln',
  'spaghetti',
  'couscous',
  'haferflocken',
  'mehl',
  'vollkornmehl',
  'gnocchi',
  'wraps',
  'vollkornbrot',
  'semmelbroesel',
  'gemuesebruehe',
  'huehnerbruehe',
];

describe('Glutenfreie Rezepte', () => {
  it('enthält in keinem als glutenfrei gekennzeichneten Rezept eine glutenhaltige Zutat', () => {
    const verstoesse = RECIPES.filter((r) => r.glutenFree).flatMap((r) =>
      r.ingredients
        .filter((zutat) => GLUTENHALTIG.includes(zutat.ingredientId))
        .map((zutat) => `${r.id}: ${zutat.ingredientId}`),
    );
    expect(verstoesse).toEqual([]);
  });

  it('kennt jede verwendete Zutat in den Stammdaten', () => {
    const unbekannt = RECIPES.flatMap((r) =>
      r.ingredients
        .filter((zutat) => !INGREDIENT_BY_ID[zutat.ingredientId])
        .map((zutat) => `${r.id}: ${zutat.ingredientId}`),
    );
    expect(unbekannt).toEqual([]);
  });

  it('bietet für jede Mahlzeit etwas an', () => {
    const glutenfrei = RECIPES.filter((r) => r.glutenFree);
    const fruehstueck = glutenfrei.filter((r) => r.categories.includes('fruehstueck'));
    // Alles, was kein Frühstück ist, taugt in dieser App für Mittag und Abend.
    const hauptgerichte = glutenfrei.filter((r) => !r.categories.includes('fruehstueck'));
    expect(fruehstueck.length).toBeGreaterThanOrEqual(3);
    expect(hauptgerichte.length).toBeGreaterThanOrEqual(6);
  });

  it('findet die glutenfreien Rezepte über den Filter und über die Textsuche', () => {
    const ueberFilter = filterRecipes(RECIPES, { activeFilters: ['glutenfrei'] });
    expect(ueberFilter.length).toBe(RECIPES.filter((r) => r.glutenFree).length);
    expect(ueberFilter.every((r) => r.glutenFree)).toBe(true);

    const ueberSuche = filterRecipes(RECIPES, { query: 'glutenfrei' });
    expect(ueberSuche.every((r) => r.glutenFree)).toBe(true);
    expect(ueberSuche.length).toBeGreaterThan(0);
  });

  it('kennzeichnet ein Rezept nur, wenn es geprüft wurde – fehlendes Feld heißt nicht "glutenfrei"', () => {
    const ungeprueft = RECIPES.find((r) => r.id === 'one-pot-bolognese-nudeln');
    expect(ungeprueft?.glutenFree).toBeUndefined();
    expect(filterRecipes(RECIPES, { activeFilters: ['glutenfrei'] })).not.toContain(ungeprueft);
  });
});
