/**
 * Liest Rezepte von Webseiten und YouTube-Videos – serverseitig, weil der
 * Browser aus Sicherheitsgruenden (CORS) fremde Seiten nicht selbst lesen darf.
 *
 * Der beste Fall: Viele Rezept-Webseiten (Chefkoch, die meisten Foodblogs,
 * viele Zeitschriften) betten ihre Zutaten und Zubereitung in einem
 * maschinenlesbaren Format ein (schema.org/Recipe als JSON-LD) – das nutzen
 * Suchmaschinen fuer die Rezept-Vorschau in den Suchergebnissen. Wird das
 * gefunden, sind Zutaten und Schritte exakt statt nur grob erraten.
 *
 * Ohne dieses Format (z. B. YouTube) bleibt nur der sichtbare Text der Seite –
 * der wird wie eingefuegter Text weiterverarbeitet (gleiche Logik wie beim
 * Foto/PDF-Import auf der Client-Seite).
 */

/* -------------------------------------------------------- JSON-LD lesen */

const LD_JSON_MUSTER = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

/** Prueft, ob ein @type-Feld (String oder Array) "Recipe" enthaelt. */
function istRezeptTyp(typ) {
  if (!typ) return false;
  const liste = Array.isArray(typ) ? typ : [typ];
  return liste.some((t) => typeof t === 'string' && t.toLowerCase() === 'recipe');
}

/** Durchsucht ein geparstes JSON-LD-Objekt (auch verschachtelt in @graph) nach einem Rezept. */
function findeRezeptInJsonLd(wert) {
  if (!wert) return null;
  if (Array.isArray(wert)) {
    for (const eintrag of wert) {
      const treffer = findeRezeptInJsonLd(eintrag);
      if (treffer) return treffer;
    }
    return null;
  }
  if (typeof wert !== 'object') return null;
  if (istRezeptTyp(wert['@type'])) return wert;
  if (wert['@graph']) return findeRezeptInJsonLd(wert['@graph']);
  return null;
}

/**
 * Sammelt alle Objekte mit einer "@id" aus einem JSON-LD-Wert (auch
 * verschachtelt). Manche Seiten (oft WordPress mit Yoast SEO) verweisen im
 * Rezept nur per "@id" auf ein Bild-Objekt, statt die URL direkt anzugeben –
 * diese Sammlung macht es möglich, so einen Verweis wieder aufzulösen.
 */
function sammleKnotenNachId(wert, sammlung) {
  if (Array.isArray(wert)) {
    for (const eintrag of wert) sammleKnotenNachId(eintrag, sammlung);
    return;
  }
  if (!wert || typeof wert !== 'object') return;
  if (typeof wert['@id'] === 'string') sammlung.set(wert['@id'], wert);
  if (wert['@graph']) sammleKnotenNachId(wert['@graph'], sammlung);
}

/** Löst ein Bildfeld auf, das nur aus einem "@id"-Verweis besteht. */
function loeseBildVerweisAuf(bild, knotenNachId) {
  if (bild && typeof bild === 'object' && !Array.isArray(bild)) {
    const hatEcht = typeof bild.url === 'string' || typeof bild.contentUrl === 'string';
    if (!hatEcht && typeof bild['@id'] === 'string') {
      const aufgeloest = knotenNachId.get(bild['@id']);
      if (aufgeloest) return aufgeloest;
    }
  }
  return bild;
}

/** Extrahiert das erste Rezept-Objekt (schema.org/Recipe) aus einer HTML-Seite. */
export function extrahiereJsonLdRezept(html) {
  const treffer = [...html.matchAll(LD_JSON_MUSTER)];
  const knotenNachId = new Map();
  const geparsteBloecke = [];

  for (const [, inhalt] of treffer) {
    try {
      const geparst = JSON.parse(inhalt.trim());
      geparsteBloecke.push(geparst);
      sammleKnotenNachId(geparst, knotenNachId);
    } catch {
      // Fehlerhaftes JSON auf der Seite – naechsten Treffer versuchen.
    }
  }

  for (const geparst of geparsteBloecke) {
    const rezept = findeRezeptInJsonLd(geparst);
    if (!rezept) continue;
    if (rezept.image) rezept.image = loeseBildVerweisAuf(rezept.image, knotenNachId);
    return rezept;
  }
  return null;
}

/* -------------------------------------------------------- Felder deuten */

/** "PT1H15M" -> 75, "PT30M" -> 30. Unbekanntes Format -> null. */
export function parseIsoDauerInMinuten(dauer) {
  if (typeof dauer !== 'string') return null;
  const treffer = dauer.match(/^PT(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!treffer) return null;
  const stunden = Number(treffer[1] ?? 0);
  const minuten = Number(treffer[2] ?? 0);
  const gesamt = stunden * 60 + minuten;
  return gesamt > 0 ? gesamt : null;
}

/** "4 Portionen", "4", ["4"], 4 -> 4. Nichts Sinnvolles gefunden -> null. */
export function parsePortionen(wert) {
  const text = Array.isArray(wert) ? wert[0] : wert;
  if (text === undefined || text === null) return null;
  const treffer = String(text).match(/\d+/);
  return treffer ? Math.max(1, Number(treffer[0])) : null;
}

/** Bildangabe in ihren vielen moeglichen Formen auf eine URL reduzieren. */
export function ersteBildUrl(bild) {
  if (!bild) return undefined;
  if (typeof bild === 'string') return bild;
  if (Array.isArray(bild)) return ersteBildUrl(bild[0]);
  if (typeof bild === 'object' && typeof bild.url === 'string') return bild.url;
  return undefined;
}

/**
 * recipeInstructions kommt in vielen Formen vor: einzelner Text, Array aus
 * Texten, HowToStep-Objekte oder in HowToSection verschachtelt. Am Ende soll
 * immer eine einfache Liste von Schritten herauskommen.
 */
export function flacheZubereitungsSchritte(anleitung) {
  if (!anleitung) return [];
  if (typeof anleitung === 'string') {
    // Manche Seiten liefern einen einzigen Fliesstext mit Zeilenumbruechen.
    return anleitung
      .split(/\r?\n+/)
      .map((z) => z.trim())
      .filter(Boolean);
  }
  if (Array.isArray(anleitung)) {
    return anleitung.flatMap((eintrag) => {
      if (typeof eintrag === 'string') return [eintrag];
      if (eintrag && typeof eintrag === 'object') {
        if (istRezeptSchrittTyp(eintrag['@type'], 'HowToSection') && eintrag.itemListElement) {
          return flacheZubereitungsSchritte(eintrag.itemListElement);
        }
        if (typeof eintrag.text === 'string') return [eintrag.text];
        if (typeof eintrag.name === 'string') return [eintrag.name];
      }
      return [];
    });
  }
  return [];
}

function istRezeptSchrittTyp(typ, gesucht) {
  const liste = Array.isArray(typ) ? typ : [typ];
  return liste.some((t) => typeof t === 'string' && t.toLowerCase() === gesucht.toLowerCase());
}

/** Nährwertangabe wie "250 kcal" / "12 g" auf die erste Zahl reduzieren. */
function ersteZahl(wert) {
  if (wert === undefined || wert === null) return 0;
  const treffer = String(wert).match(/[\d,.]+/);
  return treffer ? Number(treffer[0].replace(',', '.')) : 0;
}

/**
 * Wandelt ein rohes schema.org/Recipe-Objekt in unser eigenes, einfaches
 * Zwischenformat um – von hier übernimmt die App wie gewohnt weiter.
 */
export function zuRezeptVorschlag(jsonLd) {
  const zutatenZeilen = Array.isArray(jsonLd.recipeIngredient)
    ? jsonLd.recipeIngredient.filter((z) => typeof z === 'string' && z.trim())
    : [];

  const minuten =
    parseIsoDauerInMinuten(jsonLd.totalTime) ??
    (parseIsoDauerInMinuten(jsonLd.prepTime) ?? 0) + (parseIsoDauerInMinuten(jsonLd.cookTime) ?? 0) ??
    null;

  const nutrition = jsonLd.nutrition
    ? {
        kcal: ersteZahl(jsonLd.nutrition.calories),
        protein: ersteZahl(jsonLd.nutrition.proteinContent),
        carbs: ersteZahl(jsonLd.nutrition.carbohydrateContent),
        fat: ersteZahl(jsonLd.nutrition.fatContent),
      }
    : undefined;

  return {
    art: 'strukturiert',
    titel: typeof jsonLd.name === 'string' ? jsonLd.name : '',
    beschreibung: typeof jsonLd.description === 'string' ? jsonLd.description : '',
    zutatenZeilen,
    zubereitungsSchritte: flacheZubereitungsSchritte(jsonLd.recipeInstructions),
    bild: ersteBildUrl(jsonLd.image),
    portionen: parsePortionen(jsonLd.recipeYield) ?? undefined,
    minuten: minuten && minuten > 0 ? minuten : undefined,
    ...(nutrition ? { nutrition } : {}),
  };
}

/* --------------------------------------------------------------- YouTube */

export function istYoutubeUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\.|^m\./, '');
    return host === 'youtube.com' || host === 'youtu.be' || host === 'youtube-nocookie.com';
  } catch {
    return false;
  }
}

/**
 * YouTube liefert die volle Videobeschreibung nicht als einfaches Meta-Tag,
 * sondern eingebettet in einen grossen Datenblock innerhalb der Seite.
 * Diese Funktion sucht das "shortDescription"-Feld darin und entschluesselt
 * die JSON-Zeichenkette von Hand (naiv Regex-basiert), weil die restliche
 * Seite kein gueltiges JSON ist und sich nicht am Stueck parsen laesst.
 */
export function extrahiereYoutubeBeschreibung(html) {
  const start = html.indexOf('"shortDescription":"');
  if (start === -1) return null;
  let i = start + '"shortDescription":"'.length;
  let ergebnis = '';
  while (i < html.length) {
    const zeichen = html[i];
    if (zeichen === '"') break;
    if (zeichen === '\\') {
      const naechstes = html[i + 1];
      if (naechstes === 'n') ergebnis += '\n';
      else if (naechstes === 't') ergebnis += '\t';
      else if (naechstes === '"' || naechstes === '\\' || naechstes === '/') ergebnis += naechstes;
      else if (naechstes === 'u') {
        ergebnis += String.fromCharCode(parseInt(html.slice(i + 2, i + 6), 16));
        i += 6;
        continue;
      } else ergebnis += naechstes;
      i += 2;
      continue;
    }
    ergebnis += zeichen;
    i += 1;
  }
  return ergebnis || null;
}

function extrahiereMetaInhalt(html, name) {
  const muster = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`,
    'i',
  );
  return html.match(muster)?.[1] ?? null;
}

/** Grober Titel/Beschreibungstext, wenn weder JSON-LD noch YouTube-Daten helfen. */
export function allgemeinerVorschlag(html, url) {
  const titel = extrahiereMetaInhalt(html, 'og:title') ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? '';
  const bild = extrahiereMetaInhalt(html, 'og:image') ?? undefined;

  if (istYoutubeUrl(url)) {
    const beschreibung = extrahiereYoutubeBeschreibung(html);
    return { art: 'text', titel: titel.replace(/\s*-\s*YouTube$/, ''), bild, rohtext: beschreibung ?? '' };
  }

  const metaBeschreibung = extrahiereMetaInhalt(html, 'og:description') ?? extrahiereMetaInhalt(html, 'description');
  return { art: 'text', titel, bild, rohtext: metaBeschreibung ?? '' };
}

/** Wichtigste Funktion: aus HTML + Original-URL einen Rezeptvorschlag machen. */
export function verarbeiteHtml(html, url) {
  const jsonLd = extrahiereJsonLdRezept(html);
  if (jsonLd) {
    const vorschlag = zuRezeptVorschlag(jsonLd);
    // Ein Rezept ganz ohne Zutaten waere nutzlos – dann lieber den Textweg versuchen.
    if (vorschlag.zutatenZeilen.length > 0) return vorschlag;
  }
  return allgemeinerVorschlag(html, url);
}
