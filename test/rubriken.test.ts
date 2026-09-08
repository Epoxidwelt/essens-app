import { describe, expect, it } from 'vitest';
import { RECIPES, RECIPE_BY_ID } from '../src/data/recipes';
import { INGREDIENT_BY_ID } from '../src/data/ingredients';
import {
  FILTERS,
  FILTER_GRUPPEN,
  filterRecipes,
  findeFilter,
  istOhneSuesse,
  trefferProFilter,
} from '../src/lib/filters';

describe('Rubriken', () => {
  it('ordnet jede Rubrik einer Gruppe zu und gibt ihr Emoji und Namen', () => {
    const gruppenIds = FILTER_GRUPPEN.map((g) => g.id);
    for (const rubrik of FILTERS) {
      expect(gruppenIds, `${rubrik.id} hat keine gültige Gruppe`).toContain(rubrik.gruppe);
      expect(rubrik.emoji.length).toBeGreaterThan(0);
      expect(rubrik.name.length).toBeGreaterThan(0);
      expect(rubrik.label).toBe(`${rubrik.emoji} ${rubrik.name}`);
    }
  });

  it('vergibt jede Rubrik-id nur einmal', () => {
    const ids = FILTERS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('hat keine Rubrik, die einfach alle Rezepte liefert', () => {
    // Gefunden an "Für Kinder": Das Feld kidFriendly ist bei allen Rezepten
    // true, die Kachel filterte also nichts. Eine Rubrik, die alles trifft, ist
    // eine tote Kachel – sie kostet Platz und sagt nichts.
    const nutzlos = FILTERS.filter(
      (r) => filterRecipes(RECIPES, { activeFilters: [r.id] }).length === RECIPES.length,
    ).map((r) => r.id);
    expect(nutzlos).toEqual([]);
  });
});

describe('Rubrik "Zuckerfrei"', () => {
  it('schließt Rezepte mit süßen Zutaten aus und lässt die übrigen durch', () => {
    const mitObst = RECIPE_BY_ID['gf-hirse-porridge-apfel'];
    const ohneObst = RECIPE_BY_ID['one-pot-bolognese-nudeln'];
    expect(istOhneSuesse(mitObst)).toBe(false);
    expect(istOhneSuesse(ohneObst)).toBe(true);
  });

  it('richtet sich nach der Kennzeichnung der Zutat, nicht nach einer Liste im Filter', () => {
    // So zählt jede neu angelegte Obst-Zutat automatisch mit.
    const apfel = INGREDIENT_BY_ID['apfel'];
    expect(apfel?.sweet).toBe(true);
    expect(INGREDIENT_BY_ID['zwiebel']?.sweet).toBeUndefined();
  });

  it('liefert mindestens 30 Rezepte', () => {
    const treffer = filterRecipes(RECIPES, { activeFilters: ['zuckerfrei'] });
    expect(treffer.length).toBeGreaterThanOrEqual(30);
    expect(treffer.every(istOhneSuesse)).toBe(true);
  });
});

describe('Rubrik "Glutenfrei"', () => {
  it('liefert mindestens 30 Rezepte, alle geprüft gekennzeichnet', () => {
    const treffer = filterRecipes(RECIPES, { activeFilters: ['glutenfrei'] });
    expect(treffer.length).toBeGreaterThanOrEqual(30);
    expect(treffer.every((r) => r.glutenFree === true)).toBe(true);
  });
});

describe('Rubriken kombinieren', () => {
  it('verknüpft mehrere Rubriken mit UND', () => {
    const beide = filterRecipes(RECIPES, { activeFilters: ['zuckerfrei', 'glutenfrei'] });
    expect(beide.every((r) => r.glutenFree === true && istOhneSuesse(r))).toBe(true);
    expect(beide.length).toBeLessThanOrEqual(
      filterRecipes(RECIPES, { activeFilters: ['glutenfrei'] }).length,
    );
  });

  it('zeigt je Kachel, was sie zusätzlich zur Auswahl übrig lässt', () => {
    const zahlen = trefferProFilter(RECIPES, { activeFilters: ['glutenfrei'] });
    // Die aktive Rubrik zeigt den aktuellen Stand …
    expect(zahlen['glutenfrei']).toBe(filterRecipes(RECIPES, { activeFilters: ['glutenfrei'] }).length);
    // … eine weitere zeigt das Ergebnis der Kombination.
    expect(zahlen['zuckerfrei']).toBe(
      filterRecipes(RECIPES, { activeFilters: ['glutenfrei', 'zuckerfrei'] }).length,
    );
  });

  it('findet eine Rubrik über ihre id wieder – dafür stehen sie in der Adresszeile', () => {
    expect(findeFilter('zuckerfrei')?.name).toBe('Zuckerfrei');
    expect(findeFilter('gibtsnicht')).toBeUndefined();
  });
});

describe('Suche', () => {
  it('findet zuckerfreie und glutenfreie Rezepte auch über das Suchfeld', () => {
    const zucker = filterRecipes(RECIPES, { query: 'zuckerfrei' });
    expect(zucker.length).toBeGreaterThanOrEqual(30);
    expect(zucker.every(istOhneSuesse)).toBe(true);

    const gluten = filterRecipes(RECIPES, { query: 'glutenfrei' });
    expect(gluten.every((r) => r.glutenFree === true)).toBe(true);
  });
});
