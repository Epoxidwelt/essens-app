/**
 * Verkleinert Bilder im Browser (per Canvas), bevor sie gespeichert oder
 * zur Texterkennung geschickt werden.
 *
 * Zwei Gruende dafuer:
 *  - Gespeichert wird als Data-URL zusammen mit dem restlichen App-Zustand
 *    (auch beim Geraete-Abgleich verschickt) – ein unverkleinertes Handyfoto
 *    waere dafuer viel zu gross.
 *  - Texterkennung liest kleinere Bilder deutlich schneller, ohne dass die
 *    Lesbarkeit merklich leidet.
 */

export interface SkaliertesBild {
  dataUrl: string;
  width: number;
  height: number;
}

/** Liest eine Bilddatei in ein <img>-Element ein. */
function ladeBild(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Bild konnte nicht gelesen werden.'));
    };
    img.src = url;
  });
}

/**
 * Skaliert ein Bild auf maximal `maxDimension` Pixel (lange Seite) und
 * gibt es als JPEG-Data-URL zurueck.
 */
export async function skaliereBild(
  quelle: File | Blob | HTMLImageElement | HTMLCanvasElement,
  maxDimension: number,
  qualitaet = 0.82,
): Promise<SkaliertesBild> {
  const bild = quelle instanceof File || quelle instanceof Blob ? await ladeBild(quelle) : quelle;
  const breite = 'naturalWidth' in bild ? bild.naturalWidth || bild.width : bild.width;
  const hoehe = 'naturalHeight' in bild ? bild.naturalHeight || bild.height : bild.height;

  const faktor = Math.min(1, maxDimension / Math.max(breite, hoehe));
  const zielBreite = Math.max(1, Math.round(breite * faktor));
  const zielHoehe = Math.max(1, Math.round(hoehe * faktor));

  const canvas = document.createElement('canvas');
  canvas.width = zielBreite;
  canvas.height = zielHoehe;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas wird von diesem Browser nicht unterstützt.');
  // Weiss vorfuellen, falls das Originalbild Transparenz hat (JPEG kennt das nicht).
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, zielBreite, zielHoehe);
  ctx.drawImage(bild, 0, 0, zielBreite, zielHoehe);

  return {
    dataUrl: canvas.toDataURL('image/jpeg', qualitaet),
    width: zielBreite,
    height: zielHoehe,
  };
}
