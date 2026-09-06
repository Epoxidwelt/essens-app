/**
 * YouTube-Rezepte: Link einfügen, Titel/Vorschaubild automatisch holen.
 *
 * Es gibt keinen Zugriff auf Beschreibung oder Untertitel eines Videos ohne
 * eigenen Server oder einen bezahlten Dienst – der Browser darf YouTube-Seiten
 * aus Sicherheitsgründen (CORS) nicht selbst auslesen. Die einzige öffentliche,
 * clientseitig erreichbare Schnittstelle ist "oEmbed": sie liefert Titel,
 * Kanalname und Vorschaubild, aber keinen Beschreibungstext.
 *
 * Deshalb: Titel/Vorschaubild automatisch holen, den Beschreibungstext
 * (Zutaten/Zubereitung) fügt der Nutzer selbst ein – copy-paste aus dem
 * YouTube-Beschreibungsfeld, das er ohnehin offen hat.
 */

const OEMBED_URL = 'https://www.youtube.com/oembed';

/** Erkennt gängige YouTube-Adressformen und liefert die Video-ID. */
export function extrahiereVideoId(eingabe: string): string | null {
  const text = eingabe.trim();
  if (!text) return null;

  // Nur eine ID eingegeben (11 Zeichen, wie YouTube sie vergibt).
  if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;

  let url: URL;
  try {
    url = new URL(text.includes('://') ? text : `https://${text}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\.|^m\.|^music\./, '');
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0];
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const vParam = url.searchParams.get('v');
    if (vParam && /^[A-Za-z0-9_-]{11}$/.test(vParam)) return vParam;
    const pfadMatch = url.pathname.match(/^\/(shorts|embed|live)\/([A-Za-z0-9_-]{11})/);
    if (pfadMatch) return pfadMatch[2];
  }
  return null;
}

export interface YoutubeVideoInfo {
  videoId: string;
  titel: string;
  kanal: string;
  vorschaubild: string;
  videoUrl: string;
}

/**
 * Fragt Titel, Kanal und Vorschaubild bei YouTube ab.
 * Gibt null zurück, wenn das Video nicht gefunden wird oder keine
 * Internetverbindung besteht – der Nutzer kann dann von Hand weitermachen.
 */
export async function holeVideoInfo(eingabe: string): Promise<YoutubeVideoInfo | null> {
  const videoId = extrahiereVideoId(eingabe);
  if (!videoId) return null;

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  try {
    const antwort = await fetch(`${OEMBED_URL}?url=${encodeURIComponent(videoUrl)}&format=json`);
    if (!antwort.ok) return null;
    const daten = (await antwort.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
    if (!daten.title) return null;
    return {
      videoId,
      titel: daten.title,
      kanal: daten.author_name ?? '',
      // In hoher Auflösung statt der von oEmbed gelieferten kleinen Vorschau.
      vorschaubild: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      videoUrl,
    };
  } catch {
    return null;
  }
}
