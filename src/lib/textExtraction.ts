import { skaliereBild } from './imageResize';

/**
 * Liest Text aus einem Foto oder PDF – vollständig im Browser, ohne dass
 * die Datei irgendwohin hochgeladen wird.
 *
 * Fotos: Texterkennung (OCR) über Tesseract.js.
 * PDFs: zuerst wird der eingebettete Text gelesen (schnell, exakt); enthält
 * die Datei keinen Text (eingescanntes Blatt), werden die ersten Seiten als
 * Bild gerendert und ebenfalls per OCR gelesen.
 *
 * Beide Bibliotheken werden erst bei Bedarf nachgeladen (dynamic import),
 * damit sie die App nicht von Anfang an verlangsamen.
 */

export interface Erkennungsergebnis {
  text: string;
  /** Verkleinertes Vorschaubild – wird als Rezeptfoto übernommen. */ 
  vorschaubild: string;
  /** true, wenn Texterkennung (statt eines eingebetteten PDF-Textes) genutzt wurde. */
  perOcr: boolean;
}

export type Fortschritt = (anteil: number, schritt: string) => void;

const MAX_PDF_SEITEN_FUER_OCR = 4;

async function ladeTesseract() {
  const modul = await import('tesseract.js');
  return modul.default ?? modul;
}

async function erkenneTextAufBild(
  bild: Blob | HTMLCanvasElement,
  fortschritt?: Fortschritt,
): Promise<string> {
  const Tesseract = await ladeTesseract();
  const { data } = await Tesseract.recognize(bild, 'deu', {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') fortschritt?.(m.progress, 'Text wird gelesen …');
    },
  });
  return data.text;
}

async function ausBild(datei: File, fortschritt?: Fortschritt): Promise<Erkennungsergebnis> {
  fortschritt?.(0, 'Bild wird vorbereitet …');
  // Fuer die Erkennung etwas groesser als fuer die Anzeige – Kleingedrucktes
  // bleibt so lesbar.
  const zurErkennung = await skaliereBild(datei, 2000, 0.9);
  const vorschaubild = await skaliereBild(datei, 900, 0.82);

  const antwort = await fetch(zurErkennung.dataUrl);
  const blob = await antwort.blob();
  const text = await erkenneTextAufBild(blob, fortschritt);

  return { text, vorschaubild: vorschaubild.dataUrl, perOcr: true };
}

async function ladePdfJs() {
  const pdfjs = await import('pdfjs-dist');
  // Der Worker muss als eigene Datei ausgeliefert werden. Der Import mit "?url"
  // sorgt dafuer, dass Vite ihn mit dem richtigen Pfad einbindet – wichtig,
  // wenn die App unter einer Unteradresse liegt (z. B. GitHub Pages).
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  return pdfjs;
}

async function ausPdf(datei: File, fortschritt?: Fortschritt): Promise<Erkennungsergebnis> {
  fortschritt?.(0, 'PDF wird geöffnet …');
  const pdfjs = await ladePdfJs();
  const daten = await datei.arrayBuffer();
  const dokument = await pdfjs.getDocument({ data: daten }).promise;

  // 1. Versuch: eingebetteten Text lesen – schnell und exakt, sofern vorhanden.
  let eingebetteterText = '';
  const seitenFuerVorschau = Math.min(dokument.numPages, MAX_PDF_SEITEN_FUER_OCR);
  for (let nr = 1; nr <= dokument.numPages; nr += 1) {
    const seite = await dokument.getPage(nr);
    const inhalt = await seite.getTextContent();
    eingebetteterText += `${textZeilenAusPdfInhalt(inhalt.items)}\n`;
    fortschritt?.((nr / dokument.numPages) * 0.4, 'Text wird gelesen …');
  }

  // Erste Seite als Vorschaubild rendern, unabhaengig vom weiteren Vorgehen.
  const ersteSeite = await dokument.getPage(1);
  const vorschau = await renderSeiteAlsCanvas(ersteSeite, 900);
  const vorschaubild = (await skaliereBild(vorschau, 900, 0.82)).dataUrl;

  // Genug erkennbarer Text? Dann ist es kein eingescanntes Bild.
  if (eingebetteterText.replace(/\s+/g, '').length > 40) {
    return { text: eingebetteterText.trim(), vorschaubild, perOcr: false };
  }

  // 2. Versuch: eingescanntes PDF – Seiten als Bild rendern und per OCR lesen.
  let text = '';
  for (let nr = 1; nr <= seitenFuerVorschau; nr += 1) {
    const seite = nr === 1 ? ersteSeite : await dokument.getPage(nr);
    const canvas = await renderSeiteAlsCanvas(seite, 2000);
    fortschritt?.(0.4 + (nr / seitenFuerVorschau) * 0.2, `Seite ${nr} wird gelesen …`);
    text += `${await erkenneTextAufBild(canvas, (anteil) =>
      fortschritt?.(0.6 + (anteil * 0.4) / seitenFuerVorschau, `Seite ${nr} wird gelesen …`),
    )}\n`;
  }

  return { text: text.trim(), vorschaubild, perOcr: true };
}

/**
 * Setzt aus den Textfragmenten einer PDF-Seite wieder Zeilen zusammen.
 *
 * PDF-Text kennt von sich aus keine Zeilenumbrueche – jedes Wort (oder
 * Wortstueck) ist ein eigenes, per Koordinate positioniertes Fragment.
 * Ohne diese Rekonstruktion wuerde eine ganze Seite zu einer einzigen,
 * unbrauchbaren Textzeile zusammenschmelzen.
 */
export function textZeilenAusPdfInhalt(items: readonly unknown[]): string {
  const zeilen: string[] = [];
  let aktuelleZeile = '';
  let letzteY: number | null = null;
  let letztesEnde: number | null = null;

  for (const roh of items) {
    const item = roh as { str?: string; transform?: number[] };
    const text = item.str ?? '';
    const y = item.transform?.[5] ?? null;
    const x = item.transform?.[4] ?? null;

    if (!text) continue;

    const neueZeile = letzteY !== null && y !== null && Math.abs(y - letzteY) > 2;
    if (neueZeile) {
      zeilen.push(aktuelleZeile);
      aktuelleZeile = text;
    } else {
      // Grosse Luecke in der gleichen Zeile (z. B. Tabellenspalten) bekommt
      // trotzdem ein Leerzeichen, damit Woerter nicht zusammenkleben.
      const luecke = letztesEnde !== null && x !== null ? x - letztesEnde : 0;
      aktuelleZeile += aktuelleZeile && luecke > 1 ? ` ${text}` : text;
    }

    letzteY = y;
    letztesEnde = x !== null ? x + text.length * 5 : null;
  }
  if (aktuelleZeile) zeilen.push(aktuelleZeile);

  return zeilen.join('\n');
}

async function renderSeiteAlsCanvas(
  seite: import('pdfjs-dist').PDFPageProxy,
  zielBreite: number,
): Promise<HTMLCanvasElement> {
  const basisViewport = seite.getViewport({ scale: 1 });
  const skalierung = zielBreite / basisViewport.width;
  const viewport = seite.getViewport({ scale: skalierung });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas wird von diesem Browser nicht unterstützt.');

  await seite.render({ canvas, canvasContext: ctx, viewport }).promise;
  return canvas;
}

/** Erkennt Text aus einer hochgeladenen Datei – Foto oder PDF. */
export async function erkenneRezept(datei: File, fortschritt?: Fortschritt): Promise<Erkennungsergebnis> {
  if (datei.type === 'application/pdf' || datei.name.toLowerCase().endsWith('.pdf')) {
    return ausPdf(datei, fortschritt);
  }
  if (datei.type.startsWith('image/')) {
    return ausBild(datei, fortschritt);
  }
  throw new Error('Bitte ein Foto (JPG/PNG) oder eine PDF-Datei auswählen.');
}
