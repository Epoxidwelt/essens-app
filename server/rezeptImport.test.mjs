import { describe, expect, it } from 'vitest';
import {
  allgemeinerVorschlag,
  ersteBildUrl,
  extrahiereJsonLdRezept,
  extrahiereYoutubeBeschreibung,
  flacheZubereitungsSchritte,
  istYoutubeUrl,
  parseIsoDauerInMinuten,
  parsePortionen,
  verarbeiteHtml,
  zuRezeptVorschlag,
} from './rezeptImport.mjs';

/** Baut eine minimale HTML-Seite mit eingebettetem JSON-LD, wie echte Rezeptseiten sie liefern. */
function seiteMitJsonLd(objekt) {
  return `<!doctype html><html><head>
    <script type="application/ld+json">${JSON.stringify(objekt)}</script>
  </head><body>Rezeptinhalt</body></html>`;
}

const BEISPIEL_REZEPT = {
  '@context': 'https://schema.org',
  '@type': 'Recipe',
  name: 'Bunte Gemüsepfanne',
  description: 'Schnell, gesund, für die ganze Familie.',
  image: ['https://beispiel.de/bild-800.jpg', 'https://beispiel.de/bild-400.jpg'],
  recipeYield: '4 Portionen',
  prepTime: 'PT10M',
  cookTime: 'PT20M',
  recipeIngredient: ['500 g Brokkoli', '2 Karotten', '1 Zwiebel, gewürfelt'],
  recipeInstructions: [
    { '@type': 'HowToStep', text: 'Gemüse waschen und schneiden.' },
    { '@type': 'HowToStep', text: 'In einer Pfanne anbraten.' },
  ],
  nutrition: { '@type': 'NutritionInformation', calories: '320 kcal', proteinContent: '12 g' },
};

describe('JSON-LD-Rezept aus echten Seitenformen finden', () => {
  it('findet ein einzelnes Recipe-Objekt', () => {
    const rezept = extrahiereJsonLdRezept(seiteMitJsonLd(BEISPIEL_REZEPT));
    expect(rezept?.name).toBe('Bunte Gemüsepfanne');
  });

  it('findet ein Rezept, wenn mehrere JSON-LD-Blöcke auf der Seite stehen (Breadcrumbs o. ä.)', () => {
    const html = `<!doctype html><html><head>
      <script type="application/ld+json">${JSON.stringify({ '@type': 'BreadcrumbList', itemListElement: [] })}</script>
      <script type="application/ld+json">${JSON.stringify(BEISPIEL_REZEPT)}</script>
    </head></html>`;
    expect(extrahiereJsonLdRezept(html)?.name).toBe('Bunte Gemüsepfanne');
  });

  it('findet ein Rezept, das in ein Array aus mehreren Objekten verpackt ist', () => {
    const html = seiteMitJsonLd([{ '@type': 'Organization', name: 'Blog' }, BEISPIEL_REZEPT]);
    expect(extrahiereJsonLdRezept(html)?.name).toBe('Bunte Gemüsepfanne');
  });

  it('findet ein Rezept, das in @graph verschachtelt ist (häufig bei WordPress-Plugins)', () => {
    const html = seiteMitJsonLd({
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebPage' }, BEISPIEL_REZEPT],
    });
    expect(extrahiereJsonLdRezept(html)?.name).toBe('Bunte Gemüsepfanne');
  });

  it('erkennt @type auch als Array (z. B. ["Recipe", "NewsArticle"])', () => {
    const html = seiteMitJsonLd({ ...BEISPIEL_REZEPT, '@type': ['Recipe', 'NewsArticle'] });
    expect(extrahiereJsonLdRezept(html)?.name).toBe('Bunte Gemüsepfanne');
  });

  it('gibt null zurück, wenn kein Rezept auf der Seite ist', () => {
    expect(extrahiereJsonLdRezept('<html><body>Kein Rezept hier</body></html>')).toBeNull();
  });

  it('übersteht fehlerhaftes JSON in einem der Blöcke', () => {
    const html = `<script type="application/ld+json">{ kaputtes json </script>
      ${seiteMitJsonLd(BEISPIEL_REZEPT)}`;
    expect(extrahiereJsonLdRezept(html)?.name).toBe('Bunte Gemüsepfanne');
  });
});

describe('Einzelne Felder deuten', () => {
  it('rechnet ISO-Zeitdauern in Minuten um', () => {
    expect(parseIsoDauerInMinuten('PT30M')).toBe(30);
    expect(parseIsoDauerInMinuten('PT1H15M')).toBe(75);
    expect(parseIsoDauerInMinuten('PT2H')).toBe(120);
    expect(parseIsoDauerInMinuten('nichts gültiges')).toBeNull();
  });

  it('liest Portionsangaben in verschiedenen Schreibweisen', () => {
    expect(parsePortionen('4 Portionen')).toBe(4);
    expect(parsePortionen('4')).toBe(4);
    expect(parsePortionen(4)).toBe(4);
    expect(parsePortionen(['6 servings'])).toBe(6);
    expect(parsePortionen(undefined)).toBeNull();
  });

  it('holt die erste Bild-URL aus allen gängigen Formen', () => {
    expect(ersteBildUrl('https://x.de/bild.jpg')).toBe('https://x.de/bild.jpg');
    expect(ersteBildUrl(['https://x.de/a.jpg', 'https://x.de/b.jpg'])).toBe('https://x.de/a.jpg');
    expect(ersteBildUrl({ url: 'https://x.de/c.jpg' })).toBe('https://x.de/c.jpg');
    expect(ersteBildUrl(undefined)).toBeUndefined();
  });

  it('flacht Zubereitungsschritte in allen Formen ab', () => {
    expect(flacheZubereitungsSchritte('Schritt eins.\nSchritt zwei.')).toEqual(['Schritt eins.', 'Schritt zwei.']);
    expect(flacheZubereitungsSchritte(['Eins', 'Zwei'])).toEqual(['Eins', 'Zwei']);
    expect(flacheZubereitungsSchritte([{ '@type': 'HowToStep', text: 'Eins' }])).toEqual(['Eins']);
    // Verschachtelte Abschnitte (HowToSection), wie sie längere Rezepte oft nutzen.
    const verschachtelt = [
      {
        '@type': 'HowToSection',
        name: 'Teig',
        itemListElement: [
          { '@type': 'HowToStep', text: 'Mehl abwiegen.' },
          { '@type': 'HowToStep', text: 'Teig kneten.' },
        ],
      },
      { '@type': 'HowToStep', text: 'Backen.' },
    ];
    expect(flacheZubereitungsSchritte(verschachtelt)).toEqual(['Mehl abwiegen.', 'Teig kneten.', 'Backen.']);
  });
});

describe('Vollständiges Rezept aus JSON-LD übernehmen', () => {
  it('überträgt alle Felder korrekt', () => {
    const vorschlag = zuRezeptVorschlag(BEISPIEL_REZEPT);
    expect(vorschlag).toMatchObject({
      art: 'strukturiert',
      titel: 'Bunte Gemüsepfanne',
      beschreibung: 'Schnell, gesund, für die ganze Familie.',
      zutatenZeilen: ['500 g Brokkoli', '2 Karotten', '1 Zwiebel, gewürfelt'],
      zubereitungsSchritte: ['Gemüse waschen und schneiden.', 'In einer Pfanne anbraten.'],
      bild: 'https://beispiel.de/bild-800.jpg',
      portionen: 4,
      minuten: 30, // prepTime + cookTime, da kein totalTime angegeben
      nutrition: { kcal: 320, protein: 12, carbs: 0, fat: 0 },
    });
  });

  it('kommt mit einem minimalen Rezept ohne optionale Felder zurecht', () => {
    const minimal = { '@type': 'Recipe', name: 'Minimal', recipeIngredient: ['1 Ei'] };
    const vorschlag = zuRezeptVorschlag(minimal);
    expect(vorschlag.zutatenZeilen).toEqual(['1 Ei']);
    expect(vorschlag.portionen).toBeUndefined();
    expect(vorschlag.minuten).toBeUndefined();
    expect(vorschlag.nutrition).toBeUndefined();
  });
});

describe('verarbeiteHtml – Gesamtablauf', () => {
  it('nutzt JSON-LD, wenn vorhanden und mit Zutaten gefüllt', () => {
    const ergebnis = verarbeiteHtml(seiteMitJsonLd(BEISPIEL_REZEPT), 'https://beispiel.de/rezept');
    expect(ergebnis.art).toBe('strukturiert');
    expect(ergebnis.zutatenZeilen).toHaveLength(3);
  });

  it('fällt auf den Textweg zurück, wenn JSON-LD ohne Zutaten daherkommt', () => {
    const ohneZutaten = { '@type': 'Recipe', name: 'Leer' };
    const html = `<html><head>
      <script type="application/ld+json">${JSON.stringify(ohneZutaten)}</script>
      <meta property="og:title" content="Leeres Rezept">
      <meta property="og:description" content="Ein Beschreibungstext als Rückfalloption.">
    </head></html>`;
    const ergebnis = verarbeiteHtml(html, 'https://beispiel.de/leer');
    expect(ergebnis.art).toBe('text');
    expect(ergebnis.rohtext).toContain('Rückfalloption');
  });

  it('holt bei YouTube Titel und Beschreibung aus der Seite statt JSON-LD', () => {
    const html = `<html><head>
      <title>Mein Rezeptvideo - YouTube</title>
      <meta property="og:image" content="https://i.ytimg.com/vi/ABC/hq.jpg">
    </head><body>
      <script>var ytInitialData = {"shortDescription":"Zutaten:\\n500 g Nudeln\\n2 Eier\\n\\nZubereitung:\\nKochen."};</script>
    </body></html>`;
    const ergebnis = verarbeiteHtml(html, 'https://www.youtube.com/watch?v=ABC');
    expect(ergebnis.art).toBe('text');
    expect(ergebnis.titel).toBe('Mein Rezeptvideo');
    expect(ergebnis.rohtext).toContain('500 g Nudeln');
    expect(ergebnis.rohtext).toContain('Zubereitung:');
    expect(ergebnis.bild).toBe('https://i.ytimg.com/vi/ABC/hq.jpg');
  });
});

describe('YouTube-Beschreibung aus der Seite entschlüsseln', () => {
  it('entschlüsselt Zeilenumbrüche und Sonderzeichen korrekt', () => {
    const html = `<script>{"shortDescription":"Zeile 1\\nZeile 2 mit \\"Zitat\\" und \\u00e4"}</script>`;
    expect(extrahiereYoutubeBeschreibung(html)).toBe('Zeile 1\nZeile 2 mit "Zitat" und ä');
  });

  it('liefert null, wenn kein shortDescription-Feld existiert', () => {
    expect(extrahiereYoutubeBeschreibung('<html>nichts</html>')).toBeNull();
  });

  it('erkennt YouTube-Adressen zuverlässig', () => {
    expect(istYoutubeUrl('https://www.youtube.com/watch?v=x')).toBe(true);
    expect(istYoutubeUrl('https://youtu.be/x')).toBe(true);
    expect(istYoutubeUrl('https://chefkoch.de/rezepte/x')).toBe(false);
    expect(istYoutubeUrl('nicht-mal-eine-url')).toBe(false);
  });
});

describe('Allgemeiner Rückfallweg ohne JSON-LD', () => {
  it('liest og:title und og:description', () => {
    const html = `<html><head>
      <meta property="og:title" content="Omas Kuchen">
      <meta property="og:description" content="Ein süßer Klassiker.">
    </head></html>`;
    const vorschlag = allgemeinerVorschlag(html, 'https://blog.de/omas-kuchen');
    expect(vorschlag).toMatchObject({ art: 'text', titel: 'Omas Kuchen', rohtext: 'Ein süßer Klassiker.' });
  });

  it('fällt auf das <title>-Element zurück, wenn og:title fehlt', () => {
    const html = '<html><head><title>Nur ein Titel</title></head></html>';
    expect(allgemeinerVorschlag(html, 'https://blog.de/x').titel).toBe('Nur ein Titel');
  });
});
