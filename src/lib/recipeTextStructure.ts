/**
 * Zerlegt einen erkannten Text (aus Foto oder PDF) grob in Titel, Zutaten
 * und Zubereitungsschritte.
 *
 * Die Erkennung ist eine Hilfestellung, kein Anspruch auf Perfektion – das
 * Ergebnis landet in einem Formular, das der Nutzer vor dem Speichern prüft
 * und korrigiert. Deshalb lieber grobzügig vorbefüllen als gar nichts zeigen.
 */

export interface ErkannteStruktur {
  titel: string;
  zutatenText: string;
  zubereitungText: string;
}

const ZUTATEN_UEBERSCHRIFT = /^(zutaten|du brauchst|einkaufsliste|ingredients)\s*:?\s*$/i;
const ZUBEREITUNG_UEBERSCHRIFT =
  /^(zubereitung|anleitung|schritte|so geht'?s|so wird'?s gemacht|instructions|directions)\s*:?\s*$/i;

/** Zeile sieht nach "2 Zwiebeln" statt nach einem ganzen Satz aus. */
function siehtNachZutatAus(zeile: string): boolean {
  const bereinigt = zeile.trim();
  if (!bereinigt) return false;
  // Beginnt mit einer Zahl/einem Bruch oder einem Aufzählungszeichen.
  if (/^[-•*]\s*/.test(bereinigt)) return true;
  if (/^[\d½¼¾⅓⅔]/.test(bereinigt)) return true;
  // Kurze Zeile ohne Satzzeichen am Ende – typisch für "Salz", "Pfeffer".
  if (bereinigt.length <= 28 && !/[.!?]$/.test(bereinigt)) return true;
  return false;
}

function siehtNachSchrittAus(zeile: string): boolean {
  const bereinigt = zeile.trim();
  if (!bereinigt) return false;
  // Nummerierte Schritte ("1.", "1)") sind ein starkes Indiz.
  if (/^\d+[.)]\s+/.test(bereinigt)) return true;
  // Längere Sätze mit Punkt am Ende sind eher eine Anleitung als eine Zutat.
  return bereinigt.length > 28 && /[.!?]$/.test(bereinigt);
}

/**
 * Erkennt Titel/Zutaten/Zubereitung.
 *
 * Zuerst wird nach Überschriften ("Zutaten", "Zubereitung") gesucht – das ist
 * der zuverlässigste Fall. Findet sich keine, wird zeilenweise geraten.
 */
export function strukturiereRezeptText(rohtext: string): ErkannteStruktur {
  const zeilen = rohtext
    .split('\n')
    .map((z) => z.trim())
    .filter((z) => z.length > 0);

  if (zeilen.length === 0) {
    return { titel: '', zutatenText: '', zubereitungText: '' };
  }

  const zutatenIndex = zeilen.findIndex((z) => ZUTATEN_UEBERSCHRIFT.test(z));
  const zubereitungIndex = zeilen.findIndex((z) => ZUBEREITUNG_UEBERSCHRIFT.test(z));

  if (zutatenIndex !== -1 || zubereitungIndex !== -1) {
    // Alles vor der ersten Überschrift ist der Titel.
    const ersteUeberschrift = [zutatenIndex, zubereitungIndex]
      .filter((i) => i !== -1)
      .sort((a, b) => a - b)[0];
    const titel = zeilen.slice(0, ersteUeberschrift).join(' ');

    let zutatenZeilen: string[] = [];
    let zubereitungZeilen: string[] = [];

    if (zutatenIndex !== -1 && zubereitungIndex !== -1) {
      if (zutatenIndex < zubereitungIndex) {
        zutatenZeilen = zeilen.slice(zutatenIndex + 1, zubereitungIndex);
        zubereitungZeilen = zeilen.slice(zubereitungIndex + 1);
      } else {
        zubereitungZeilen = zeilen.slice(zubereitungIndex + 1, zutatenIndex);
        zutatenZeilen = zeilen.slice(zutatenIndex + 1);
      }
    } else if (zutatenIndex !== -1) {
      zutatenZeilen = zeilen.slice(zutatenIndex + 1);
    } else {
      zubereitungZeilen = zeilen.slice(zubereitungIndex + 1);
    }

    return {
      titel,
      zutatenText: zutatenZeilen.join('\n'),
      zubereitungText: zubereitungZeilen.join('\n'),
    };
  }

  // Keine Überschriften gefunden: erste Zeile ist der Titel, der Rest wird
  // zeilenweise nach Aussehen sortiert.
  const [titel, ...restZeilen] = zeilen;
  const zutatenZeilen: string[] = [];
  const zubereitungZeilen: string[] = [];

  for (const zeile of restZeilen) {
    if (siehtNachSchrittAus(zeile)) zubereitungZeilen.push(zeile);
    else if (siehtNachZutatAus(zeile)) zutatenZeilen.push(zeile);
    else zubereitungZeilen.push(zeile);
  }

  return {
    titel,
    zutatenText: zutatenZeilen.join('\n'),
    zubereitungText: zubereitungZeilen.join('\n'),
  };
}
