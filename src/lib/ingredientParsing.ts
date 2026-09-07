import type { Ingredient, RecipeIngredient, Unit } from '../types';
import { INGREDIENTS } from '../data/ingredients';
import { OHNE_MENGE } from './quantity';

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
  // Rezeptseiten schreiben die Pluralendung oft in Klammern ("Knoblauchzehe(n)",
  // "Stück(e)") – fuer die Einheitenerkennung stoert sie nur.
  const varianten = [token, token.replace(/\([^()]*\)$/, '')];
  for (const [muster, einheit] of UNIT_ALIASES) {
    if (varianten.some((v) => v && muster.test(v))) return einheit;
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
  // Ohne diesen Eintrag landet "Knoblauch" beim Teilstring-Abgleich auf
  // "Lauch" – zwei voellig verschiedene Zutaten.
  knoblauch: 'knoblauch',
  knoblauchzehe: 'knoblauch',
  kartoffeln: 'kartoffel',
  pasta: 'nudeln',
  nudel: 'nudeln',
  cherrytomate: 'kirschtomaten',
  cherrytomaten: 'kirschtomaten',
  paprikaschote: 'paprika',
  paprikaschoten: 'paprika',
};

/** "Salz und Pfeffer" ist eine Aufzählung, keine einzelne Zutat – nicht zusammenfassend abgleichen. */
function istAufzaehlung(text: string): boolean {
  return /\bund\b/i.test(text);
}

/**
 * Trennt einen Klammerzusatz am Zeilenende ab: "Tomaten (geschält)" -> Hinweis
 * "geschält". Klammern dürfen dabei verschachtelt sein ("Pasta (eurer Wahl (wir
 * nehmen gerne Spaghetti))") – sonst bliebe der ganze Zusatz Teil des Namens und
 * die Zutat würde in der Einkaufsliste mit nichts mehr zusammengerechnet.
 *
 * Nur mit Leerzeichen davor: direkt am Wort ("Zwiebel(n)") ist es meist eine
 * Pluralendung und bleibt Teil des Namens.
 */
function trenneKlammerzusatz(text: string): { rumpf: string; hinweis?: string } {
  if (!text.endsWith(')')) return { rumpf: text };
  let tiefe = 0;
  for (let i = text.length - 1; i >= 0; i -= 1) {
    if (text[i] === ')') tiefe += 1;
    else if (text[i] === '(') {
      tiefe -= 1;
      if (tiefe > 0) continue;
      if (i === 0 || text[i - 1] !== ' ') return { rumpf: text };
      const hinweis = text.slice(i + 1, -1).trim();
      const rumpf = text.slice(0, i).trim();
      if (!hinweis || !rumpf) return { rumpf: text };
      return { rumpf, hinweis };
    }
  }
  return { rumpf: text };
}

/**
 * Größen- und Frischeangaben vor dem Namen. Sie sagen nichts darüber, *was*
 * gekauft wird – bleiben sie im Namen stehen, wird aus "kleiner Rosmarinzweig"
 * eine eigene Zutat, die sich nie mit "Rosmarinzweig" zusammenrechnet.
 * Bewusst kurz gehalten: "rote Zwiebel" etwa ist eine andere Zutat als
 * "Zwiebel" und darf nicht gekürzt werden.
 */
const FUELLADJEKTIVE = /^(kleine?[nrs]?|mittelgro(ß|ss)e?[nrs]?|gro(ß|ss)e?[nrs]?|frische?[nrs]?|getrocknete?[nrs]?)\s+/i;

/** Trennt ein solches Adjektiv ab und gibt es als Hinweis zurück. */
function trenneFuelladjektiv(name: string): { rumpf: string; hinweis?: string } {
  const treffer = name.match(FUELLADJEKTIVE);
  if (!treffer) return { rumpf: name };
  const rumpf = name.slice(treffer[0].length).trim();
  if (!rumpf) return { rumpf: name };
  return { rumpf, hinweis: treffer[1] };
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

  // Danach: der gesuchte Text enthält den Namen einer Stammzutat als Wortstamm,
  // egal an welcher Stelle (z. B. "Zwiebeln" enthält "zwiebel", "Etwas
  // Muskatnuss" enthält "muskatnuss"). Bei mehreren Treffern gewinnt der
  // laengste (spezifischste) Wortstamm.
  const wortstammTreffer = besterTreffer(
    kandidaten,
    (kandidatName) => gesucht.includes(kandidatName) && kandidatName.length / gesucht.length >= 0.5,
  );
  if (wortstammTreffer) return wortstammTreffer;

  // Umgekehrt: der Stammname ist laenger und beginnt mit dem gesuchten Text
  // (z. B. "Hähnchenbrust" -> "Hähnchenbrustfilet"). Bewusst nur als Vorsilbe
  // (startsWith), nicht als beliebige Teilzeichenkette – sonst wuerde ein
  // generischer Begriff wie "Tomaten" faelschlich zu "Kirschtomaten"
  // aufgewertet, nur weil "tomaten" zufaellig das Ende dieses laengeren,
  // anders zusammengesetzten Namens ist. Ein angehaengtes Wort wie "-filet"
  // beschreibt meist nur eine Form, ein vorangestelltes wie "Kirsch-" aber
  // oft eine andere Zutat.
  return besterTreffer(
    kandidaten,
    (kandidatName) => kandidatName.startsWith(gesucht) && gesucht.length / kandidatName.length >= 0.5,
  );
}

function besterTreffer(
  kandidaten: Ingredient[],
  passt: (kandidatName: string) => boolean,
): Ingredient | null {
  let bester: Ingredient | null = null;
  let besteLaenge = 0;
  for (const kandidat of kandidaten) {
    const kandidatName = normalisiere(kandidat.name);
    if (kandidatName.length < 3) continue;
    if (!passt(kandidatName)) continue;
    if (kandidatName.length > besteLaenge) {
      bester = kandidat;
      besteLaenge = kandidatName.length;
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
 * Namen und Zusatz. Nennt die Zeile gar keine Menge ("Salz und Pfeffer"),
 * wird auch keine erfunden – die Zutat gilt dann als "nach Bedarf".
 */
export function parseZutatenzeile(zeile: string, bekannteEigene: Ingredient[] = []): GeparsteZutat | null {
  const roh = zeile.trim().replace(/^[-•*]\s*/, '');
  if (!roh) return null;

  const { rumpf: bereinigt, hinweis: klammerHinweis } = trenneKlammerzusatz(roh);

  // Zusatz nach einem Komma abtrennen: "Zwiebel, fein gewürfelt".
  const [hauptteil, ...rest] = bereinigt.split(',');
  const kommaHinweis = rest.join(',').trim() || undefined;

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

  const einheit = parseUnit(worte[index]);
  // Steht nach dem Einheitenwort nichts mehr ("2 Knoblauchzehen"), ist es
  // zugleich der Zutatenname. Es trotzdem zu verbrauchen liesse die Zeile
  // ohne Namen zurueck – die Zutat fiele stillschweigend aus dem Rezept.
  const einheitIstAuchName = einheit !== null && index + 1 >= worte.length;
  if (einheit && !einheitIstAuchName) index += 1;

  const rohName = worte.slice(index).join(' ').trim();
  if (!rohName) return null;

  const { rumpf: name, hinweis: adjektivHinweis } = trenneFuelladjektiv(rohName);
  const note =
    [adjektivHinweis, kommaHinweis, klammerHinweis].filter(Boolean).join(' · ') || undefined;

  // Ohne Zahl in der Zeile bleibt die Menge offen (0 = "nach Bedarf"); eine
  // erfundene Menge würde beim Umrechnen auf andere Portionszahlen sonst zu
  // Unsinn wie "½ Stück Salz und Pfeffer" führen.
  const finaleMenge = menge ?? OHNE_MENGE;
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
