import type { Ingredient, Recipe } from '../types';
import { RECIPES, RECIPE_BY_ID } from '../data/recipes';
import { INGREDIENT_BY_ID } from '../data/ingredients';

/**
 * Fuehrt mitgelieferte und selbst hinzugefuegte Rezepte/Zutaten zusammen.
 *
 * Ueberall dort, wo Nutzer Rezepte sehen (Startseite, Uebersicht, Suche,
 * Wochenplan), muessen eigene Rezepte gleichwertig neben den eingebauten
 * auftauchen. Diese Funktionen sind die einzige Stelle, die das tut – so
 * bleibt der Rest der App einfach.
 */

export function alleRezepte(custom: Recipe[]): Recipe[] {
  return custom.length ? [...custom, ...RECIPES] : RECIPES;
}

export function findeRezept(id: string, custom: Recipe[]): Recipe | undefined {
  return custom.find((r) => r.id === id) ?? RECIPE_BY_ID[id];
}

/** Zutat nachschlagen – zuerst Stammdaten, dann selbst angelegte. */
export function findeZutat(id: string, customIngredients: Ingredient[]): Ingredient | undefined {
  return INGREDIENT_BY_ID[id] ?? customIngredients.find((i) => i.id === id);
}
