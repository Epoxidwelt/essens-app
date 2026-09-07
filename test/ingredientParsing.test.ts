import { describe, expect, it } from 'vitest';
import { findeBekannteZutat, parseZutatenText, parseZutatenzeile } from '../src/lib/ingredientParsing';
import { formatQuantity, scaleAmount } from '../src/lib/quantity';

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

  it('erkennt einen Klammerzusatz am Zeilenende als Hinweis (nicht als Teil des Namens)', () => {
    const r = parseZutatenzeile('400 g Rigatoni (oder Penne)');
    expect(r?.recipeIngredient.note).toBe('oder Penne');
    expect(r?.ingredient.name).toBe('Rigatoni');
  });

  it('lässt eine direkt angehängte Klammer (Pluralendung) am Wort, statt sie als Hinweis abzutrennen', () => {
    const r = parseZutatenzeile('1 Zwiebel(n)');
    expect(r?.recipeIngredient.note).toBeUndefined();
    expect(r?.ingredient.id).toBe('zwiebel');
  });

  it('kombiniert Komma- und Klammerzusatz, wenn beide vorkommen', () => {
    const r = parseZutatenzeile('1 Chilischote(n), fein gehackt (frische)');
    expect(r?.recipeIngredient.note).toBe('fein gehackt · frische');
  });

  it('erkennt "Pasta" als dasselbe wie "Nudeln", damit sich beide zusammenrechnen', () => {
    // Rezept-Webseiten schreiben meist "Pasta", die App-Stammdaten "Nudeln" –
    // ohne das Synonym landen zwei Positionen auf der Einkaufsliste.
    expect(parseZutatenzeile('500 g Pasta')?.recipeIngredient.ingredientId).toBe('nudeln');
  });

  it('erkennt "Cherrytomate" als Synonym für Kirschtomaten', () => {
    expect(parseZutatenzeile('400 g Cherrytomaten')?.recipeIngredient.ingredientId).toBe('kirschtomaten');
  });

  it('legt eine neue Zutat an, wenn nichts passt', () => {
    const r = parseZutatenzeile('300 g Tofu');
    expect(r?.neu).toBe(true);
    expect(r?.ingredient.name).toBe('Tofu');
    expect(r?.ingredient.category).toBe('sonstiges');
  });

  it('erfindet keine Menge, wenn die Zeile keine nennt', () => {
    // Gefunden an einem echten Chefkoch-Rezept: "Salz und Pfeffer" wurde als
    // "1 Stk" gelesen und beim Umrechnen auf 4 statt 5 Portionen zu
    // "½ Stk Salz und Pfeffer" – Unsinn. Ohne Zahl bleibt die Menge offen.
    const r = parseZutatenzeile('Salz und Pfeffer');
    expect(r?.recipeIngredient.amount).toBe(0);
    expect(formatQuantity(r!.recipeIngredient.amount, r!.recipeIngredient.unit)).toBe('nach Bedarf');
  });

  it('erkennt die Zutat auch ohne Menge ("Etwas Muskatnuss")', () => {
    const r = parseZutatenzeile('Etwas Muskatnuss');
    expect(r?.ingredient.id).toBe('muskat');
    expect(r?.recipeIngredient.amount).toBe(0);
  });

  it('eine offene Menge bleibt beim Umrechnen offen, statt zu schrumpfen', () => {
    const r = parseZutatenzeile('Olivenöl');
    const skaliert = scaleAmount(r!.recipeIngredient.amount, r!.recipeIngredient.unit, 5, 4);
    expect(skaliert).toBe(0);
  });

  it('trennt auch einen verschachtelten Klammerzusatz vom Namen ab', () => {
    // Echtes Chefkoch-Rezept: der Name hiess sonst
    // "Pasta (eurer Wahl (wir nehmen gerne Spaghetti))" und rechnete sich
    // in der Einkaufsliste mit keiner anderen Pasta mehr zusammen.
    const r = parseZutatenzeile('500 g Pasta (eurer Wahl (wir nehmen gerne Spaghetti))');
    expect(r?.recipeIngredient.ingredientId).toBe('nudeln');
    expect(r?.recipeIngredient.note).toBe('eurer Wahl (wir nehmen gerne Spaghetti)');
    expect(r?.recipeIngredient.amount).toBe(500);
    // Ohne die Klammer-Behandlung hiesse die Zutat "Pasta (eurer Wahl (...))"
    // und wuerde neu angelegt statt auf die Stammzutat zu treffen.
    expect(r?.neu).toBe(false);
  });

  it('trennt eine Größenangabe vor dem Namen ab, damit sie das Zusammenrechnen nicht verhindert', () => {
    const r = parseZutatenzeile('1 kleiner Rosmarinzweig(e) (frischer)');
    expect(r?.ingredient.id).toBe('rosmarin');
    expect(r?.recipeIngredient.note).toBe('kleiner · frischer');
    // Dieselbe Zutat ohne Größenangabe landet auf derselben Stammzutat.
    expect(parseZutatenzeile('2 Rosmarinzweige')?.ingredient.id).toBe('rosmarin');
  });

  it('kürzt eine Farbangabe nicht weg – "rote Zwiebel" ist eine andere Zutat', () => {
    expect(parseZutatenzeile('2 rote Zwiebeln')?.ingredient.id).toBe('rote-zwiebel');
  });

  it('behandelt "X und Y" als eine (neue) Zutat statt sie auf nur eine zu verkürzen', () => {
    const r = parseZutatenzeile('Salz und Pfeffer');
    expect(r?.neu).toBe(true);
    expect(r?.ingredient.name).toBe('Salz und Pfeffer');
  });

  it('verliert eine Zutat nicht, wenn das Einheitenwort zugleich der Name ist', () => {
    // "2 Knoblauchzehen" verschwand komplett aus dem Rezept: "Knoblauchzehen"
    // wurde als Einheit verbraucht, danach war kein Name mehr uebrig.
    const r = parseZutatenzeile('2 Knoblauchzehen');
    expect(r).not.toBeNull();
    expect(r?.recipeIngredient).toMatchObject({ ingredientId: 'knoblauch', amount: 2, unit: 'Zehe' });
  });

  it('erkennt eine Einheit auch mit Klammer-Pluralendung, wie Rezeptseiten sie schreiben', () => {
    // Genau diese Schreibweise liefert Chefkoch aus.
    const r = parseZutatenzeile('2 Knoblauchzehe(n)');
    expect(r?.recipeIngredient).toMatchObject({ ingredientId: 'knoblauch', amount: 2, unit: 'Zehe' });
    // Damit rechnet sich die importierte Zeile mit der Schreibweise der
    // mitgelieferten Rezepte ("2 Zehen") auf der Einkaufsliste zusammen.
    expect(parseZutatenzeile('2 Zehen Knoblauch')?.recipeIngredient.unit).toBe('Zehe');
  });

  it('verwechselt Knoblauch nicht mit Lauch', () => {
    expect(parseZutatenzeile('2 Zehen Knoblauch')?.ingredient.id).toBe('knoblauch');
    expect(findeBekannteZutat('Knoblauch')?.id).toBe('knoblauch');
    expect(findeBekannteZutat('Lauch')?.id).toBe('lauch');
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

  it('wertet einen generischen Begriff nicht fälschlich zu einer spezifischeren Zutat auf', () => {
    // "Tomaten" darf nicht zu "Kirschtomaten" werden, nur weil "tomaten" zufällig
    // das Ende des längeren, spezifischeren Namens ist (echter Fund bei echten
    // Chefkoch-Rezepten: "500 g Tomaten, passierte" wurde sonst zu Kirschtomaten).
    expect(findeBekannteZutat('Tomaten')?.id).toBe('tomate');
    expect(findeBekannteZutat('Tomate')?.id).toBe('tomate');
    // Der eigentliche Anwendungsfall der Regel bleibt weiter erlaubt:
    expect(findeBekannteZutat('Kirschtomaten')?.id).toBe('kirschtomaten');
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
