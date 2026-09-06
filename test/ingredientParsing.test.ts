import { describe, expect, it } from 'vitest';
import { findeBekannteZutat, parseZutatenText, parseZutatenzeile } from '../src/lib/ingredientParsing';

describe('Zutatenzeilen erkennen', () => {
  it('erkennt Menge, Einheit und bekannten Namen', () => {
    const r = parseZutatenzeile('500 g Kartoffeln');
    expect(r?.recipeIngredient).toMatchObject({ amount: 500, unit: 'g', ingredientId: 'kartoffel' });
    expect(r?.neu).toBe(false);
  });

  it('erkennt Stück ohne Einheitswort', () => {
    const r = parseZutatenzeile('2 Zwiebeln');
    expect(r?.recipeIngredient).toMatchObject({ amount: 2, unit: 'Stk', ingredientId: 'zwiebel' });
  });

  it('erkennt Brüche', () => {
    expect(parseZutatenzeile('½ TL Salz')?.recipeIngredient).toMatchObject({ amount: 0.5, unit: 'TL' });
    expect(parseZutatenzeile('1 1/2 EL Öl')?.recipeIngredient.amount).toBe(1.5);
  });

  it('trennt einen Zusatz nach dem Komma ab', () => {
    const r = parseZutatenzeile('1 Zwiebel, fein gewürfelt');
    expect(r?.recipeIngredient.note).toBe('fein gewürfelt');
    expect(r?.recipeIngredient.ingredientId).toBe('zwiebel');
  });

  it('erkennt verschiedene Schreibweisen von Einheiten', () => {
    expect(parseZutatenzeile('2 Esslöffel Zucker')?.recipeIngredient.unit).toBe('EL');
    expect(parseZutatenzeile('1 Prise Salz')?.recipeIngredient.unit).toBe('Prise');
    expect(parseZutatenzeile('200 Gramm Mehl')?.recipeIngredient.unit).toBe('g');
  });

  it('legt eine neue Zutat an, wenn nichts passt', () => {
    const r = parseZutatenzeile('300 g Tofu');
    expect(r?.neu).toBe(true);
    expect(r?.ingredient.name).toBe('Tofu');
    expect(r?.ingredient.category).toBe('sonstiges');
  });

  it('ohne erkennbare Menge wird 1 Stück angenommen, Zeile bleibt nutzbar', () => {
    // "Etwas" ist ein Füllwort ohne Menge – die Zutat wird trotzdem erkannt.
    const r = parseZutatenzeile('Etwas Muskatnuss');
    expect(r?.recipeIngredient.amount).toBe(1);
    expect(r?.recipeIngredient.unit).toBe('Stk');
    expect(r?.ingredient.id).toBe('muskat');
  });

  it('behandelt "X und Y" als eine (neue) Zutat statt sie auf nur eine zu verkürzen', () => {
    const r = parseZutatenzeile('Salz und Pfeffer');
    expect(r?.neu).toBe(true);
    expect(r?.ingredient.name).toBe('Salz und Pfeffer');
  });

  it('ignoriert leere Zeilen und Aufzählungszeichen', () => {
    expect(parseZutatenzeile('')).toBeNull();
    expect(parseZutatenzeile('   ')).toBeNull();
    expect(parseZutatenzeile('- 2 Eier')?.recipeIngredient.ingredientId).toBe('ei');
  });
});

describe('Bekannte Zutat finden', () => {
  it('findet über Teilstring in beide Richtungen', () => {
    expect(findeBekannteZutat('Zwiebeln')?.id).toBe('zwiebel');
    expect(findeBekannteZutat('rote Zwiebel')?.id).toBe('rote-zwiebel');
    expect(findeBekannteZutat('Knoblauchzehen')).toBeTruthy();
  });

  it('liefert null für zu kurze oder unpassende Begriffe', () => {
    expect(findeBekannteZutat('xyz123')).toBeNull();
  });
});

describe('Mehrzeiliger Zutatentext', () => {
  it('parst mehrere Zeilen und erkennt neue Zutaten nur einmal', () => {
    const ergebnis = parseZutatenText(
      ['500 g Tofu', '200 g Tofu', '1 Zwiebel'].join('\n'),
    );
    expect(ergebnis).toHaveLength(3);
    // Die zweite Tofu-Zeile trifft jetzt auf die zuvor "neu" angelegte Zutat.
    expect(ergebnis[0].neu).toBe(true);
    expect(ergebnis[1].neu).toBe(false);
    expect(ergebnis[0].ingredient.id).toBe(ergebnis[1].ingredient.id);
  });

  it('funktioniert mit realistischem, mehrzeiligem Text aus einer Erkennung', () => {
    const text = `
      600 g Hähnchenbrust
      2 Karotten
      1 Zwiebel, gewürfelt
      3 EL Sojasauce
      1 TL Ingwer, gerieben
    `;
    const ergebnis = parseZutatenText(text);
    expect(ergebnis.map((e) => e.recipeIngredient.ingredientId)).toEqual([
      'haehnchenbrust',
      'moehre',
      'zwiebel',
      'eigene-sojasauce',
      'ingwer',
    ]);
  });
});
