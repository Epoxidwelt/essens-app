/** Einfache Pluralisierung: plural(1, 'Rezept', 'Rezepte') -> "1 Rezept". */
export function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

/** Beschreibt den Haushalt, z. B. "2 Erwachsene + 2 Kinder". */
export function describeHousehold(adults: number, kids: number): string {
  const parts = [plural(adults, 'Erwachsener', 'Erwachsene')];
  if (kids > 0) parts.push(plural(kids, 'Kind', 'Kinder'));
  return parts.join(' + ');
}
