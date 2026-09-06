import type { Ingredient, RecipeIngredient, Unit } from '../types';
import { INGREDIENTS } from '../data/ingredients';

/**
 * Wandelt eine frei eingetippte oder aus Foto/PDF erkannte Zutatenzeile
 * ("2 Zwiebeln", "500 g Kartoffeln, gewürfelt") in eine strukturierte
 * Zutat um – die Grundlage dafür, dass auch selbst hinzugefügte Rezepte
 * in der Einkaufsliste automatisch zusammengerechnet werden.
 *
 * Bekannte Zutaten (Zwiebel, Kartoffel, ...) werden erkannt und auf den
 * Stammdatensatz gemappt. Unbekannte Wörter werden als neue Zutat angelegt.
 */

const FRACTION_WORDS: Record<string, number> = {
  '¼': 0.25,
  '½': 0.5,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
};

/** Einheiten-Schreibweisen, wie sie in Rezepten typischerweise vorkommen. */
const UNIT_ALIASES: Array<[RegExp, Unit]> = [
  [/^(g|gramm)\.?$/i, 'g'],
  [/^(kg|kilo|kilogramm)\.?$/i, 'kg'],
  [/^(ml|milliliter)\.?$/i, 'ml'],
  [/^(l|liter)\.?$/i, 'l'],
  [/^(el|esslöffel|esslöffeln)\.?$/i, 'EL'],
  [/^(tl|teelöffel|teelöffeln)\.?$/i, 'TL'],
  [/^(stk|stück|stücke|st)\.?$/i, 'Stk'],
  [/^(zehen?|knoblauchzehen?)$/i, 'Zehe'],
  [/^(prisen?)$/i, 'Prise'],
  [/^(bund|bünde)\.?$/i, 'Bund'],
  [/^(dosen?)\.?$/i, 'Dose'],
  [/^(pack(ung)?en?|pck\.?|pkg\.?)$/i, 'Packung'],
  [/^(scheiben?)$/i, 'Scheibe'],
];

function parseAmount(token: string): number | null {
  const bruch = FRACTION_WORDS[token];
  if (bruch !== undefined) return bruch;

  // "1 1/2" oder "1/2"
  const bruchZahl = token.match(/^(\d+)?\s*\/\s*(\d+)$/);
  if (bruchZahl) {
    const [, ganze, nenner] = bruchZahl;
    return Number(nenner) ? (Number(ganze ?? 0) || 0) / Number(nenner) : null;
  }

  const zahl = Number(token.replace(',', '.'));
  return Number.isFinite(zahl) ? zahl : null;
}

function parseUnit(token: string | undefined): Unit | null {
  if (!token) return null;
  for (const [muster, einheit] of UNIT_ALIASES) {
    if (muster.test(token)) return einheit;
  }
  return null;
}

/** Gängige andere Namen, die nicht wortähnlich genug für den Teilstring-Abgleich sind. */
const SYNONYME: Record<string, string> = {
  karotte: 'moehre',
  karotten: 'moehre',
  moehren: 'moehre',
  fruehlingszwiebeln: 'fruehlingszwiebel',
  knoblauchzehen: 'knoblauch',
  kartoffeln: 'kartoffel',
};

/** "Salz und Pfeffer" ist eine Aufzählung, keine einzelne Zutat – nicht zusammenfassend abgleichen. */
function istAufzaehlung(text: string): boolean {
  return /\bund\b/i.test(text);
}

/** Vereinfacht einen Namen für den Vergleich: klein, ohne Sonderzeichen, ohne Plural-s/-n/-e. */
function normalisiere(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/** Sucht eine Stammzutat, deren Name zum eingegebenen Text passt. */
export function findeBekannteZutat(
  name: string,
  weitereZutaten: Ingredient[] = [],
): Ingredient | null {
  const gesucht = normalisiere(name);
  if (!gesucht) return null;
  const kandidaten = [...INGREDIENTS, ...weitereZutaten];

  // Exakter Treffer zuerst.
  const exakt = kandidaten.find((i) => normalisiere(i.name) === gesucht);
  if (exakt) return exakt;

  // Bekannte andere Bezeichnung (Karotte -> Möhre, ...).
  const synonymId = SYNONYME[gesucht];
  if (synonymId) {
    const treffer = kandidaten.find((i) => i.id === synonymId);
    if (treffer) return treffer;
  }

  // "Salz und Pfeffer" ist eine Aufzählung zweier Zutaten in einer Zeile –
  // das würde beim Teilstring-Abgleich faelschlich auf nur eine davon
  // zusammenschrumpfen. Lieber als neue, eigene Zutat anlegen.
  if (istAufzaehlung(name)) return null;

  // Danach: Stammzutat ist im gesuchten Text enthalten oder umgekehrt
  // (z. B. "Zwiebeln" enthält "zwiebel", "rote Zwiebel" enthält "zwiebel").
  // Der Treffer muss einen Grossteil des gesuchten Texts abdecken, sonst
  // wuerden kurze Woerter wie "Ei" in vielen Namen zufaellig auftauchen.
  let bester: Ingredient | null = null;
  let besteLaenge = 0;
  for (const kandidat of kandidaten) {
    const kandidatName = normalisiere(kandidat.name);
    if (kandidatName.length < 3) continue;
    const kuerzer = Math.min(kandidatName.length, gesucht.length);
    const laenger = Math.max(kandidatName.length, gesucht.length);
    const deckungsgrad = kuerzer / laenger;
    if ((gesucht.includes(kandidatName) || kandidatName.includes(gesucht)) && deckungsgrad >= 0.5) {
      if (kandidatName.length > besteLaenge) {
        bester = kandidat;
        besteLaenge = kandidatName.length;
      }
    }
  }
  return bester;
}

/** Erzeugt eine neue Zutat aus einem Namen, der zu keiner Stammzutat passt. */
export function neueZutatAus(name: string): Ingredient {
  const slug =
    normalisiere(name).slice(0, 40) || `zutat-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id: `eigene-${slug}`,
    name: name.trim().replace(/\s+/g, ' '),
    category: 'sonstiges',
  };
}

export interface GeparsteZutat {
  ingredient: Ingredient;
  /** true, wenn die Zutat neu angelegt wurde (kein Treffer in den Stammdaten). */
  neu: boolean;
  recipeIngredient: RecipeIngredient;
}

/**
 * Zerlegt eine Zeile wie "500 g Kartoffeln, gewürfelt" in Menge, Einheit,
 * Namen und Zusatz. Ohne erkennbare Menge wird 1 Stück angenommen – die
 * Zeile bleibt so nutzbar, auch wenn die Erkennung nicht perfekt war.
 */
export function parseZutatenzeile(zeile: string, bekannteEigene: Ingredient[] = []): GeparsteZutat | null {
  const bereinigt = zeile.trim().replace(/^[-•*]\s*/, '');
  if (!bereinigt) return null;

  // Zusatz nach einem Komma abtrennen: "Zwiebel, fein gewürfelt".
  const [hauptteil, ...rest] = bereinigt.split(',');
  const note = rest.join(',').trim() || undefined;

  const worte = hauptteil.trim().split(/\s+/);
  let index = 0;
  let menge: number | null = null;

  // Erste ein bis zwei Zahlen-Token zusammen als Menge lesen ("1", "1/2", "1 1/2").
  while (index < worte.length && index < 2) {
    const versuch = parseAmount(worte[index]);
    if (versuch === null) break;
    menge = (menge ?? 0) + versuch;
    index += 1;
  }

  let einheit = parseUnit(worte[index]);
  if (einheit) index += 1;

  const name = worte.slice(index).join(' ').trim();
  if (!name) return null;

  const finaleMenge = menge ?? 1;
  const finaleEinheit: Unit = einheit ?? 'Stk';

  const bekannt = findeBekannteZutat(name, bekannteEigene);
  const ingredient = bekannt ?? neueZutatAus(name);

  return {
    ingredient,
    neu: !bekannt,
    recipeIngredient: {
      ingredientId: ingredient.id,
      amount: finaleMenge,
      unit: finaleEinheit,
      ...(note ? { note } : {}),
    },
  };
}

/** Zerlegt einen mehrzeiligen Zutatentext, eine Zeile pro Zutat. */
export function parseZutatenText(text: string): GeparsteZutat[] {
  const bekannteEigene: Ingredient[] = [];
  const ergebnis: GeparsteZutat[] = [];
  for (const zeile of text.split('\n')) {
    const geparst = parseZutatenzeile(zeile, bekannteEigene);
    if (!geparst) continue;
    if (geparst.neu) bekannteEigene.push(geparst.ingredient);
    ergebnis.push(geparst);
  }
  return ergebnis;
}
