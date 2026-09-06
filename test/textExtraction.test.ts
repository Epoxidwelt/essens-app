import { describe, expect, it } from 'vitest';
import { textZeilenAusPdfInhalt } from '../src/lib/textExtraction';

/**
 * PDF.js liefert Textfragmente ohne Zeilenumbrueche – nur eine Position
 * (transform[4] = x, transform[5] = y) verrät, wo eine neue Zeile beginnt.
 * Dieser Test bildet genau das nach, wie es reportlab/Word/PDF-Drucker
 * typischerweise erzeugen: mehrere Woerter pro Zeile als eigene Fragmente.
 */
function fragment(text: string, x: number, y: number) {
  return { str: text, transform: [1, 0, 0, 1, x, y] };
}

describe('PDF-Textfragmente zu Zeilen zusammensetzen', () => {
  it('erkennt einen Zeilenwechsel an der y-Koordinate', () => {
    const items = [fragment('Titel', 50, 800), fragment('Zutaten', 50, 770), fragment('Zubereitung', 50, 740)];
    expect(textZeilenAusPdfInhalt(items)).toBe('Titel\nZutaten\nZubereitung');
  });

  it('reiht mehrere Fragmente derselben Zeile aneinander (wie bei Word-Exporten üblich)', () => {
    // "500 g Kartoffeln" kommt oft als 3 einzelne Fragmente auf gleicher Höhe.
    const items = [fragment('500', 50, 700), fragment('g', 68, 700), fragment('Kartoffeln', 78, 700)];
    expect(textZeilenAusPdfInhalt(items)).toBe('500 g Kartoffeln');
  });

  it('lässt eng aneinanderliegende Fragmente ohne Leerzeichen zusammenwachsen (Silbentrennung/Kerning)', () => {
    // Manche PDFs teilen ein einzelnes Wort in Fragmente ohne Luecke dazwischen.
    const items = [fragment('Kar', 50, 700), fragment('offeln', 65, 700)];
    expect(textZeilenAusPdfInhalt(items)).toBe('Karoffeln');
  });

  it('ignoriert leere Fragmente', () => {
    const items = [fragment('Zutaten', 50, 800), fragment('', 50, 780), fragment('1 Ei', 50, 760)];
    expect(textZeilenAusPdfInhalt(items)).toBe('Zutaten\n1 Ei');
  });

  it('kommt mit leerer Eingabe zurecht', () => {
    expect(textZeilenAusPdfInhalt([])).toBe('');
  });

  it('baut ein vollständiges, mehrzeiliges Rezept korrekt zusammen', () => {
    const items = [
      ...['Bunte', 'Linsensuppe'].map((w, i) => fragment(w, 50 + i * 60, 800)),
      fragment('Zutaten', 50, 760),
      ...['300', 'g', 'rote', 'Linsen'].map((w, i) => fragment(w, 50 + i * 40, 730)),
      ...['2', 'Karotten'].map((w, i) => fragment(w, 50 + i * 20, 700)),
    ];
    const zeilen = textZeilenAusPdfInhalt(items).split('\n');
    expect(zeilen).toEqual(['Bunte Linsensuppe', 'Zutaten', '300 g rote Linsen', '2 Karotten']);
  });
});
