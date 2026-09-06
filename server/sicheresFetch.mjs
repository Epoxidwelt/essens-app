/**
 * Ruft eine vom Nutzer eingegebene Adresse ab – aber nur, wenn sie wirklich
 * ins offene Internet zeigt.
 *
 * Ohne diese Pruefung koennte jemand den Server dazu bringen, interne
 * Adressen im Heimnetz oder auf dem Server selbst abzufragen (z. B.
 * "http://192.168.1.1/admin" oder "http://localhost:22") – ein klassischer
 * SSRF-Angriff. Der Endpunkt ist zwar durch das Familienpasswort geschuetzt,
 * aber die Adresse kommt trotzdem von aussen und wird deshalb streng geprueft:
 * nur http/https, keine privaten/internen IP-Bereiche, das gilt auch fuer
 * jede Weiterleitung.
 */
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB – genug fuer jede normale Webseite
const ZEITLIMIT_MS = 10_000;
const MAX_WEITERLEITUNGEN = 5;

/** true, wenn die IP in einem privaten/internen/reservierten Bereich liegt. */
export function istPrivateIp(ip) {
  const art = isIP(ip);
  if (art === 4) {
    const teile = ip.split('.').map(Number);
    const [a, b] = teile;
    if (a === 127) return true; // Loopback
    if (a === 10) return true; // privat
    if (a === 172 && b >= 16 && b <= 31) return true; // privat
    if (a === 192 && b === 168) return true; // privat
    if (a === 169 && b === 254) return true; // Link-lokal, u. a. Cloud-Metadaten
    if (a === 100 && b >= 64 && b <= 127) return true; // Carrier-grade NAT
    if (a === 0) return true;
    return false;
  }
  if (art === 6) {
    const normal = ip.toLowerCase();
    if (normal === '::1') return true; // Loopback
    if (normal.startsWith('::ffff:')) return istPrivateIp(normal.slice(7)); // IPv4-in-IPv6
    if (/^fe[89ab][0-9a-f]:/.test(normal)) return true; // Link-lokal
    if (/^f[cd][0-9a-f]{2}:/.test(normal)) return true; // Unique Local (privat)
    return false;
  }
  return true; // Unbekanntes Format lieber ablehnen als durchlassen.
}

/** Prueft Protokoll und – nach Aufloesung des Hostnamens – die Ziel-IP. */
async function pruefeUrl(url) {
  let ziel;
  try {
    ziel = new URL(url);
  } catch {
    throw new Error('Das ist keine gültige Internetadresse.');
  }
  if (ziel.protocol !== 'http:' && ziel.protocol !== 'https:') {
    throw new Error('Nur http- und https-Adressen sind erlaubt.');
  }
  const { address } = await lookup(ziel.hostname);
  if (istPrivateIp(address)) {
    throw new Error('Diese Adresse zeigt auf ein internes Netzwerk und wird nicht abgerufen.');
  }
  return ziel;
}

/**
 * Ruft eine Adresse ab und gibt den Text zurueck. Weiterleitungen werden von
 * Hand verfolgt (nicht dem automatischen Redirect von fetch ueberlassen),
 * damit jede einzelne Zieladresse erneut geprueft wird.
 */
export async function holeSeiteSicher(url, extraHeader = {}) {
  let aktuelleUrl = url;
  for (let versuch = 0; versuch <= MAX_WEITERLEITUNGEN; versuch += 1) {
    const geprueft = await pruefeUrl(aktuelleUrl);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ZEITLIMIT_MS);
    let antwort;
    try {
      antwort = await fetch(geprueft, {
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; EssensApp/1.0; +familienserver)',
          Accept: 'text/html,application/xhtml+xml',
          ...extraHeader,
        },
      });
    } finally {
      clearTimeout(timer);
    }

    if (antwort.status >= 300 && antwort.status < 400) {
      const ziel = antwort.headers.get('location');
      if (!ziel) throw new Error('Weiterleitung ohne Ziel erhalten.');
      aktuelleUrl = new URL(ziel, geprueft).toString();
      continue;
    }

    if (!antwort.ok) {
      throw new Error(`Die Seite konnte nicht geladen werden (Status ${antwort.status}).`);
    }

    // Groesse begrenzen, ohne erst die komplette Antwort in den Speicher zu laden.
    const reader = antwort.body?.getReader();
    if (!reader) return antwort.text();
    const teile = [];
    let gesamt = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      gesamt += value.length;
      if (gesamt > MAX_BYTES) {
        await reader.cancel();
        throw new Error('Die Seite ist zu groß.');
      }
      teile.push(value);
    }
    return Buffer.concat(teile).toString('utf8');
  }
  throw new Error('Zu viele Weiterleitungen.');
}
