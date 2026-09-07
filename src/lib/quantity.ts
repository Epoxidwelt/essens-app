import type { Unit } from '../types';

/**
 * Mengenlogik der App.
 *
 * Zwei Aufgaben:
 *  1. Portionen skalieren (Rezeptmenge -> gewuenschte Portionszahl)
 *  2. Einheiten normalisieren, damit gleiche Zutaten aus verschiedenen Rezepten
 *     in der Einkaufsliste verlustfrei zusammengerechnet werden koennen.
 */

/** Einheitenfamilien mit gemeinsamer Basiseinheit. */
type UnitFamily = 'mass' | 'volume' | 'spoon' | string;

const FAMILY: Partial<Record<Unit, { family: UnitFamily; base: Unit; factor: number }>> = {
  g: { family: 'mass', base: 'g', factor: 1 },
  kg: { family: 'mass', base: 'g', factor: 1000 },
  ml: { family: 'volume', base: 'ml', factor: 1 },
  l: { family: 'volume', base: 'ml', factor: 1000 },
  TL: { family: 'spoon', base: 'TL', factor: 1 },
  EL: { family: 'spoon', base: 'TL', factor: 3 },
};

/** Einheiten ohne Umrechnung bilden je eine eigene Familie (Stk, Bund, Zehe ...). */
export function unitFamily(unit: Unit): UnitFamily {
  return FAMILY[unit]?.family ?? `unit:${unit}`;
}

/** Rechnet eine Menge in die Basiseinheit ihrer Familie um. */
export function toBase(amount: number, unit: Unit): { amount: number; unit: Unit } {
  const f = FAMILY[unit];
  return f ? { amount: amount * f.factor, unit: f.base } : { amount, unit };
}

/**
 * Rundet eine Menge so, dass sie in der Kueche brauchbar ist.
 * Grosse Grammangaben werden auf 5er/10er gerundet, Stueck auf halbe Stueck usw.
 */
export function roundAmount(amount: number, unit: Unit): number {
  if (amount <= 0) return 0;
  const snap = (step: number) => Math.max(step, Math.round(amount / step) * step);
  switch (unit) {
    case 'g':
    case 'ml':
      if (amount < 20) return Math.round(amount);
      if (amount < 100) return snap(5);
      if (amount < 1000) return snap(10);
      return snap(50);
    case 'kg':
    case 'l':
      return Math.round(amount * 100) / 100;
    case 'Stk':
    case 'Zehe':
      return amount < 1 ? 0.5 : snap(0.5);
    case 'EL':
    case 'TL':
      return amount < 1 ? 0.5 : snap(0.5);
    case 'Bund':
      return amount < 0.5 ? 0.25 : snap(0.25);
    case 'Prise':
    case 'Scheibe':
    case 'Dose':
    case 'Packung':
      return Math.max(1, Math.round(amount));
    default:
      return Math.round(amount * 10) / 10;
  }
}

/** Skaliert eine Rezeptmenge auf die gewuenschte Portionszahl. */
export function scaleAmount(
  amount: number,
  unit: Unit,
  baseServings: number,
  servings: number,
): number {
  if (baseServings <= 0) return amount;
  return roundAmount((amount * servings) / baseServings, unit);
}

const FRACTIONS: Array<[number, string]> = [
  [0.25, '¼'],
  [0.5, '½'],
  [0.75, '¾'],
];

/** Formatiert eine Zahl menschenlesbar: 1.5 -> "1½", 0.5 -> "½", 250 -> "250". */
export function formatNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const whole = Math.floor(rounded);
  const rest = Math.round((rounded - whole) * 100) / 100;
  const fraction = FRACTIONS.find(([v]) => Math.abs(v - rest) < 0.001)?.[1];
  if (fraction) return whole === 0 ? fraction : `${whole}${fraction}`;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded).replace('.', ',');
}

/**
 * Waehlt fuer die Anzeige die angenehmste Einheit:
 * 1500 g -> 1,5 kg, 1000 ml -> 1 l, 6 TL -> 2 EL.
 */
export function displayQuantity(amount: number, unit: Unit): { amount: number; unit: Unit } {
  if (unit === 'g' && amount >= 1000) return { amount: Math.round(amount / 10) / 100, unit: 'kg' };
  if (unit === 'ml' && amount >= 1000) return { amount: Math.round(amount / 10) / 100, unit: 'l' };
  if (unit === 'TL' && amount >= 3) return { amount: roundAmount(amount / 3, 'EL'), unit: 'EL' };
  return { amount, unit };
}

/** Einheiten, bei denen Brueche natuerlicher wirken als Dezimalzahlen. */
const FRACTION_UNITS: Unit[] = ['Stk', 'EL', 'TL', 'Bund', 'Zehe', 'Dose', 'Packung', 'Scheibe'];

/**
 * Menge 0 heisst: Das Rezept nennt gar keine Menge ("Salz und Pfeffer", "Öl").
 * Statt eine Menge zu erfinden, die dann auch noch mitskaliert wuerde
 * ("½ Stk Salz und Pfeffer"), wird das als solches angezeigt.
 */
export const OHNE_MENGE = 0;

export function istOhneMenge(amount: number): boolean {
  return amount <= 0;
}

/** Fertiger Anzeigetext, z. B. "1,5 kg", "½ Bund" oder "nach Bedarf". */
export function formatQuantity(amount: number, unit: Unit): string {
  if (istOhneMenge(amount)) return 'nach Bedarf';
  const d = displayQuantity(amount, unit);
  const text = FRACTION_UNITS.includes(d.unit)
    ? formatNumber(d.amount)
    : formatDecimal(d.amount);
  return `${text} ${d.unit}`;
}

/** Dezimaldarstellung fuer Gewichte und Volumen: 1.5 -> "1,5". */
export function formatDecimal(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace('.', ',');
}
