/**
 * Kleine Helfer, um aus den Rezeptdaten gültiges SQL zu erzeugen
 * (siehe scripts/generate-seed.ts).
 *
 * Wichtig ist vor allem `sqlText`: Apostrophe müssen verdoppelt werden,
 * sonst bricht die SQL-Anweisung ab.
 */

/** Text als SQL-Literal, NULL für fehlende Werte. */
export function sqlText(value: string | undefined | null): string {
  if (value === undefined || value === null) return 'null';
  return `'${value.replace(/'/g, "''")}'`;
}

export function sqlBool(value: boolean): string {
  return value ? 'true' : 'false';
}

/** Zahl als SQL-Literal; verhindert NaN/Infinity in der Ausgabe. */
export function sqlNumber(value: number): string {
  if (!Number.isFinite(value)) throw new Error(`Ungültige Zahl für SQL: ${value}`);
  return String(value);
}

export function sqlJson(value: unknown): string {
  return `${sqlText(JSON.stringify(value))}::jsonb`;
}

export function sqlTextArray(values: string[]): string {
  return `array[${values.map(sqlText).join(', ')}]::text[]`;
}
