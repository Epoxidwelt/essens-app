import type { AppState } from '../types';

/**
 * Verbindung zum Familien-Server (server/serve.mjs).
 *
 * Der Server laeuft im eigenen WLAN und liefert die App selbst aus – deshalb
 * genuegt derselbe Ursprung wie die Seite. Laeuft die App ueber den
 * Entwicklungsserver, kann die Adresse ueber VITE_SYNC_URL gesetzt werden.
 *
 * Ist kein Server erreichbar, arbeitet die App unveraendert nur lokal weiter.
 */

const BASE =
  (import.meta.env.VITE_SYNC_URL as string | undefined)?.replace(/\/$/, '') ??
  // Gleiche Adresse wie die App selbst – inklusive Unterpfad.
  import.meta.env.BASE_URL.replace(/\/$/, '');

export interface RemoteState {
  version: number;
  updatedAt: string | null;
  state: AppState | null;
}

/** Ergebnis einer Serverabfrage: erreichbar, Anmeldung noetig, oder aus. */
export type SyncErgebnis<T> =
  | { art: 'ok'; wert: T }
  | { art: 'anmeldung' }
  | { art: 'aus' };

const TIMEOUT_MS = 4000;
const TOKEN_KEY = 'essens-app.token';

/** Zugangsmarke dieses Geraets – wird nach der Anmeldung gespeichert. */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignorieren */
  }
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const token = getToken();
  try {
    return await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Meldet dieses Geraet mit dem Familienpasswort an.
 * Die Zugangsmarke bleibt gespeichert – man gibt das Passwort nur einmal ein.
 */
export async function anmelden(passwort: string): Promise<{ ok: true } | { ok: false; fehler: string }> {
  try {
    const res = await fetch(`${BASE}/api/anmelden`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwort }),
    });
    const daten = (await res.json().catch(() => ({}))) as { token?: string; fehler?: string };
    if (!res.ok || !daten.token) {
      return { ok: false, fehler: daten.fehler ?? 'Anmeldung fehlgeschlagen.' };
    }
    setToken(daten.token);
    return { ok: true };
  } catch {
    return { ok: false, fehler: 'Server nicht erreichbar.' };
  }
}

export function abmelden(): void {
  setToken(null);
}

/** Version des Servers – guenstige Abfrage fuer das regelmaessige Nachsehen. */
export async function fetchVersion(): Promise<SyncErgebnis<number>> {
  try {
    const res = await request('/api/status');
    if (!res.ok) return { art: 'aus' };
    const data = (await res.json()) as { server?: string; version?: number; geschuetzt?: boolean };
    if (data.server !== 'essens-app' || typeof data.version !== 'number') return { art: 'aus' };
    // Geschuetzter Server, aber dieses Geraet hat noch keine Zugangsmarke.
    if (data.geschuetzt && !getToken()) return { art: 'anmeldung' };
    return { art: 'ok', wert: data.version };
  } catch {
    return { art: 'aus' };
  }
}

export async function fetchState(): Promise<SyncErgebnis<RemoteState>> {
  try {
    const res = await request('/api/stand');
    if (res.status === 401) return { art: 'anmeldung' };
    if (!res.ok) return { art: 'aus' };
    return { art: 'ok', wert: (await res.json()) as RemoteState };
  } catch {
    return { art: 'aus' };
  }
}

/** Von einer Webseite übernommenes Rezept – exakt (schema.org gefunden) oder als Rohtext. */
export type RezeptImportErgebnis =
  | {
      art: 'strukturiert';
      titel: string;
      beschreibung: string;
      zutatenZeilen: string[];
      zubereitungsSchritte: string[];
      bild?: string;
      portionen?: number;
      minuten?: number;
      nutrition?: { kcal: number; protein: number; carbs: number; fat: number };
    }
  | { art: 'text'; titel?: string; bild?: string; rohtext: string };

/**
 * Ergebnis eines Link-Imports: anders als die übrigen Serverabfragen wird
 * hier zwischen "Server nicht erreichbar" und "Server hat abgelehnt"
 * unterschieden – Letzteres hat einen konkreten, fuer den Nutzer sinnvollen
 * Grund (z. B. eine ungueltige Adresse), der angezeigt werden soll.
 */
export type LinkImportErgebnis =
  | { art: 'ok'; wert: RezeptImportErgebnis }
  | { art: 'anmeldung' }
  | { art: 'aus' }
  | { art: 'abgelehnt'; meldung: string };

/**
 * Lässt den Familien-Server eine Webseite oder ein YouTube-Video lesen.
 * Braucht laenger als die uebrigen Anfragen (der Server ruft selbst eine
 * fremde Seite ab) – deshalb ein eigenes, grosszügigeres Zeitlimit.
 */
export async function importiereRezeptVonLink(url: string): Promise<LinkImportErgebnis> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const token = getToken();
    const res = await fetch(`${BASE}/api/rezept-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });
    if (res.status === 401) return { art: 'anmeldung' };
    if (res.status === 400 || res.status === 429) {
      const daten = (await res.json().catch(() => ({}))) as { fehler?: string };
      return { art: 'abgelehnt', meldung: daten.fehler ?? 'Das hat leider nicht funktioniert.' };
    }
    if (!res.ok) return { art: 'aus' };
    return { art: 'ok', wert: (await res.json()) as RezeptImportErgebnis };
  } catch {
    return { art: 'aus' };
  } finally {
    clearTimeout(timer);
  }
}

/** Schickt den eigenen Stand zum Server. Gibt die neue Version zurueck. */
export async function pushState(state: AppState): Promise<SyncErgebnis<number>> {
  try {
    const res = await request('/api/stand', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    });
    if (res.status === 401) return { art: 'anmeldung' };
    if (!res.ok) return { art: 'aus' };
    const data = (await res.json()) as { version?: number };
    if (typeof data.version !== 'number') return { art: 'aus' };
    return { art: 'ok', wert: data.version };
  } catch {
    return { art: 'aus' };
  }
}
