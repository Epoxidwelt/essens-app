import { describe, expect, it } from 'vitest';
import { strukturiereRezeptText } from '../src/lib/recipeTextStructure';

describe('Rezepttext strukturieren – mit Überschriften', () => {
  it('erkennt Zutaten und Zubereitung anhand von Überschriften', () => {
    const text = [
      'Omas Kartoffelsuppe',
      'Zutaten',
      '500 g Kartoffeln',
      '2 Möhren',
      '1 Zwiebel',
      'Zubereitung',
      '1. Kartoffeln und Möhren schälen und würfeln.',
      '2. Alles 20 Minuten köcheln lassen.',
    ].join('\n');

    const r = strukturiereRezeptText(text);
    expect(r.titel).toBe('Omas Kartoffelsuppe');
    expect(r.zutatenText.split('\n')).toEqual(['500 g Kartoffeln', '2 Möhren', '1 Zwiebel']);
    expect(r.zubereitungText).toContain('Kartoffeln und Möhren schälen');
    expect(r.zubereitungText).toContain('20 Minuten köcheln');
  });

  it('funktioniert auch, wenn "Zubereitung" vor "Zutaten" steht', () => {
    const text = ['Titel', 'Zubereitung', 'Schritt eins.', 'Zutaten', '1 Ei'].join('\n');
    const r = strukturiereRezeptText(text);
    expect(r.zutatenText).toBe('1 Ei');
    expect(r.zubereitungText).toBe('Schritt eins.');
  });

  it('erkennt großzügig ähnliche Überschriften', () => {
    const text = ['Titel', 'DU BRAUCHST:', '1 Ei', "SO GEHT'S", 'Schritt eins.'].join('\n');
    const r = strukturiereRezeptText(text);
    expect(r.zutatenText).toBe('1 Ei');
    expect(r.zubereitungText).toBe('Schritt eins.');
  });
});

describe('Rezepttext strukturieren – ohne Überschriften (geraten)', () => {
  it('sortiert kurze Zeilen als Zutaten, lange Sätze als Schritte', () => {
    const text = [
      'Schnelle Tomatensauce',
      '400 g Tomaten',
      'Salz',
      'Pfeffer',
      'Die Tomaten in einem Topf zehn Minuten köcheln lassen und würzen.',
    ].join('\n');

    const r = strukturiereRezeptText(text);
    expect(r.titel).toBe('Schnelle Tomatensauce');
    expect(r.zutatenText.split('\n')).toEqual(['400 g Tomaten', 'Salz', 'Pfeffer']);
    expect(r.zubereitungText).toContain('zehn Minuten köcheln');
  });

  it('erkennt nummerierte Schritte auch ohne Überschrift', () => {
    const text = ['Titel', '1) Wasser aufkochen', '2) Nudeln zugeben'].join('\n');
    const r = strukturiereRezeptText(text);
    expect(r.zubereitungText.split('\n')).toHaveLength(2);
  });

  it('kommt mit leerem Text zurecht', () => {
    expect(strukturiereRezeptText('')).toEqual({ titel: '', zutatenText: '', zubereitungText: '' });
    expect(strukturiereRezeptText('   \n  \n')).toEqual({ titel: '', zutatenText: '', zubereitungText: '' });
  });

  it('kommt mit nur einer Titelzeile zurecht', () => {
    const r = strukturiereRezeptText('Nur ein Titel');
    expect(r.titel).toBe('Nur ein Titel');
    expect(r.zutatenText).toBe('');
    expect(r.zubereitungText).toBe('');
  });
});
