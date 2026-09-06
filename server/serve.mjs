/**
 * Familien-Server der Essens App.
 *
 * Läuft bei euch zu Hause und macht zwei Dinge:
 *   1. Er liefert die fertige App aus (Ordner dist/), damit Handys sie im
 *      WLAN öffnen können.
 *   2. Er hält einen gemeinsamen Datenstand, damit Favoriten, Einkaufsliste
 *      und Wochenplan auf allen Geräten gleich sind.
 *
 * Bewusst ohne jede Fremdbibliothek – nur eingebautes Node. Es gibt keinen
 * Cloud-Dienst, kein Konto und keine Daten, die das Haus verlassen.
 *
 * Start:  npm start
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const DATA_DIR = join(ROOT, 'server', 'daten');
const STATE_FILE = join(DATA_DIR, 'stand.json');
const SESSION_FILE = join(DATA_DIR, 'sitzungen.json');
const PORT = Number(process.env.PORT ?? 5190);

/**
 * Familienpasswort.
 *
 * Ist ESSENS_PASSWORT gesetzt, muss sich jedes Gerät einmal anmelden, bevor es
 * Daten lesen oder schreiben darf. Ohne Passwort läuft der Server ungeschützt –
 * das ist nur im eigenen WLAN vertretbar, niemals auf einem Server, der aus dem
 * Internet erreichbar ist.
 */
const PASSWORT = process.env.ESSENS_PASSWORT ?? '';
const GESCHUETZT = PASSWORT.length > 0;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/* ----------------------------------------------------------- Datenhaltung */

/** Gemeinsamer Stand: { version, updatedAt, state }. */
async function readState() {
  try {
    return JSON.parse(await readFile(STATE_FILE, 'utf8'));
  } catch {
    return { version: 0, updatedAt: null, state: null };
  }
}

let writeQueue = Promise.resolve();

/** Schreibvorgänge werden nacheinander ausgeführt, damit nichts verloren geht. */
function writeState(next) {
  writeQueue = writeQueue.then(async () => {
    await mkdir(DATA_DIR, { recursive: true });
    // Erst in eine Nebendatei schreiben, dann umbenennen: so bleibt bei einem
    // Absturz immer eine vollständige Datei zurück.
    const tmp = `${STATE_FILE}.tmp`;
    await writeFile(tmp, JSON.stringify(next, null, 2), 'utf8');
    const { rename } = await import('node:fs/promises');
    await rename(tmp, STATE_FILE);
  });
  return writeQueue;
}

/* -------------------------------------------------------------- Anmeldung */

/**
 * Angemeldete Geräte: Zugangsmarke -> Zeitpunkt der Anmeldung.
 * Marken laufen nach SITZUNG_GUELTIG_TAGE ab; ein verlorenes Handy hat damit
 * nicht für immer Zugriff.
 */
let sitzungen = new Map();

const SITZUNG_GUELTIG_TAGE = Number(process.env.ESSENS_SITZUNG_TAGE ?? 180);
const SITZUNG_GUELTIG_MS = SITZUNG_GUELTIG_TAGE * 24 * 60 * 60 * 1000;

function abgelaufen(erstellt) {
  return Date.now() - erstellt > SITZUNG_GUELTIG_MS;
}

async function ladeSitzungen() {
  sitzungen = new Map();
  try {
    const daten = JSON.parse(await readFile(SESSION_FILE, 'utf8'));
    if (Array.isArray(daten)) {
      for (const eintrag of daten) {
        // Altes Format (nur Zeichenketten) weiter unterstützen.
        if (typeof eintrag === 'string') sitzungen.set(eintrag, Date.now());
        else if (eintrag?.token && !abgelaufen(eintrag.erstellt)) {
          sitzungen.set(eintrag.token, eintrag.erstellt);
        }
      }
    }
  } catch {
    /* noch keine Datei – dann gibt es eben keine Sitzungen */
  }
}

async function speichereSitzungen() {
  await mkdir(DATA_DIR, { recursive: true });
  const daten = [...sitzungen].map(([token, erstellt]) => ({ token, erstellt }));
  await writeFile(SESSION_FILE, JSON.stringify(daten, null, 2), 'utf8');
}

/** Vergleich in gleichbleibender Zeit – verrät nichts über das richtige Passwort. */
function passwortStimmt(eingabe) {
  const a = createHash('sha256').update(String(eingabe)).digest();
  const b = createHash('sha256').update(PASSWORT).digest();
  return timingSafeEqual(a, b);
}

/** Bremst wiederholtes Raten aus, je Absender. */
const fehlversuche = new Map();
const SPERRE_AB = 8;
const SPERRE_DAUER_MS = 10 * 60 * 1000;

function gesperrt(absender) {
  const eintrag = fehlversuche.get(absender);
  if (!eintrag) return false;
  if (Date.now() - eintrag.zuletzt > SPERRE_DAUER_MS) {
    fehlversuche.delete(absender);
    return false;
  }
  return eintrag.anzahl >= SPERRE_AB;
}

function merkeFehlversuch(absender) {
  const eintrag = fehlversuche.get(absender) ?? { anzahl: 0, zuletzt: 0 };
  eintrag.anzahl += 1;
  eintrag.zuletzt = Date.now();
  fehlversuche.set(absender, eintrag);
}

/** Prüft die mitgeschickte Zugangsmarke. */
function angemeldet(req) {
  if (!GESCHUETZT) return true;
  const kopf = req.headers.authorization ?? '';
  const marke = kopf.startsWith('Bearer ') ? kopf.slice(7) : '';
  if (marke.length === 0) return false;
  const erstellt = sitzungen.get(marke);
  if (erstellt === undefined) return false;
  if (abgelaufen(erstellt)) {
    sitzungen.delete(marke);
    void speichereSitzungen();
    return false;
  }
  return true;
}

function readBody(req, limitBytes = 5_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(new Error('Anfrage zu groß'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const json = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
};

/* ---------------------------------------------------------- Dateiausgabe */

async function serveFile(res, filePath, { spaFallback = true } = {}) {
  const safe = normalize(filePath);
  if (!safe.startsWith(DIST)) {
    json(res, 403, { fehler: 'Zugriff verweigert' });
    return;
  }
  try {
    const info = await stat(safe);
    if (info.isDirectory()) throw new Error('Verzeichnis');
    const type = MIME[extname(safe).toLowerCase()] ?? 'application/octet-stream';
    // index.html nie zwischenspeichern, damit Updates sofort ankommen.
    const cache = safe.endsWith('index.html')
      ? 'no-cache'
      : safe.includes(`${join('dist', 'assets')}`)
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600';
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': info.size, 'Cache-Control': cache });
    createReadStream(safe).pipe(res);
  } catch {
    if (spaFallback) {
      await serveFile(res, join(DIST, 'index.html'), { spaFallback: false });
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Nicht gefunden');
  }
}

/* -------------------------------------------------------------- Anfragen */

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  // Schutzkoepfe – wichtig, sobald der Server aus dem Internet erreichbar ist.
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'same-origin');

  // Die App wird vom selben Server ausgeliefert und braucht deshalb keine
  // Freigabe für fremde Herkünfte. Nur für die Entwicklung (npm run dev)
  // kann eine erlaubte Adresse gesetzt werden.
  const ERLAUBT = process.env.ESSENS_ERLAUBTE_HERKUNFT ?? '';
  if (ERLAUBT) {
    res.setHeader('Access-Control-Allow-Origin', ERLAUBT);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (url.pathname === '/api/status') {
    const stand = await readState();
    json(res, 200, {
      server: 'essens-app',
      geschuetzt: GESCHUETZT,
      version: stand.version,
      updatedAt: stand.updatedAt,
    });
    return;
  }

  if (url.pathname === '/api/anmelden') {
    if (req.method !== 'POST') {
      json(res, 405, { fehler: 'Methode nicht erlaubt' });
      return;
    }
    if (!GESCHUETZT) {
      json(res, 200, { token: 'offen', hinweis: 'Dieser Server ist ohne Passwort eingerichtet.' });
      return;
    }
    const absender = req.socket.remoteAddress ?? 'unbekannt';
    if (gesperrt(absender)) {
      json(res, 429, { fehler: 'Zu viele Versuche. Bitte in einigen Minuten erneut probieren.' });
      return;
    }
    try {
      const body = JSON.parse(await readBody(req, 10_000));
      if (typeof body?.passwort !== 'string' || !passwortStimmt(body.passwort)) {
        merkeFehlversuch(absender);
        json(res, 401, { fehler: 'Passwort stimmt nicht.' });
        return;
      }
      fehlversuche.delete(absender);
      const marke = randomBytes(32).toString('hex');
      sitzungen.set(marke, Date.now());
      await speichereSitzungen();
      json(res, 200, { token: marke });
    } catch {
      json(res, 400, { fehler: 'Fehlerhafte Anfrage' });
    }
    return;
  }

  if (url.pathname === '/api/sitzungen') {
    // Alle Geräte abmelden – nützlich, wenn ein Handy verloren geht.
    if (req.method !== 'DELETE') {
      json(res, 405, { fehler: 'Methode nicht erlaubt' });
      return;
    }
    if (!angemeldet(req)) {
      json(res, 401, { fehler: 'Anmeldung erforderlich' });
      return;
    }
    const anzahl = sitzungen.size;
    sitzungen.clear();
    await speichereSitzungen();
    json(res, 200, { abgemeldet: anzahl });
    return;
  }

  if (url.pathname === '/api/stand') {
    if (!angemeldet(req)) {
      json(res, 401, { fehler: 'Anmeldung erforderlich' });
      return;
    }
    if (req.method === 'GET') {
      json(res, 200, await readState());
      return;
    }
    if (req.method === 'PUT') {
      try {
        const body = JSON.parse(await readBody(req));
        if (!body || typeof body !== 'object' || !body.state) {
          json(res, 400, { fehler: 'Kein gültiger Stand übergeben' });
          return;
        }
        const aktuell = await readState();
        const naechster = {
          version: aktuell.version + 1,
          updatedAt: new Date().toISOString(),
          state: body.state,
        };
        await writeState(naechster);
        json(res, 200, { version: naechster.version, updatedAt: naechster.updatedAt });
      } catch (e) {
        json(res, 400, { fehler: e instanceof Error ? e.message : 'Fehlerhafte Anfrage' });
      }
      return;
    }
    json(res, 405, { fehler: 'Methode nicht erlaubt' });
    return;
  }

  if (req.method !== 'GET') {
    json(res, 405, { fehler: 'Methode nicht erlaubt' });
    return;
  }

  const pfad = decodeURIComponent(url.pathname);
  await serveFile(res, join(DIST, pfad === '/' ? 'index.html' : pfad));
});

/** Adresse im Heimnetz, damit Handys die App finden. */
function netzAdressen() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((n) => n && n.family === 'IPv4' && !n.internal)
    .map((n) => `http://${n.address}:${PORT}`);
}

async function pruefeDist() {
  try {
    await stat(join(DIST, 'index.html'));
    return true;
  } catch {
    return false;
  }
}

if (!(await pruefeDist())) {
  console.error('\n  Es gibt noch keine fertige App-Version.');
  console.error('  Bitte zuerst ausführen:  npm run build\n');
  process.exit(1);
}

await ladeSitzungen();

server.listen(PORT, '0.0.0.0', () => {
  const stand = dirname(STATE_FILE);
  console.log('\n  🍽️  Essens App läuft\n');
  console.log(`  Auf diesem Rechner:  http://localhost:${PORT}`);
  for (const adresse of netzAdressen()) {
    console.log(`  Im WLAN (Handy):     ${adresse}`);
  }
  console.log(`\n  Gemeinsame Daten:    ${stand}`);
  if (GESCHUETZT) {
    console.log(
      `  Zugang:              mit Familienpasswort (${sitzungen.size} Gerät(e) angemeldet, ` +
        `Anmeldung gilt ${SITZUNG_GUELTIG_TAGE} Tage)`,
    );
  } else {
    console.log('\n  ⚠️  OHNE PASSWORT: Jeder, der diese Adresse erreicht, kann eure Daten');
    console.log('      lesen und ändern. Im eigenen WLAN in Ordnung – auf einem Server,');
    console.log('      der aus dem Internet erreichbar ist, unbedingt setzen:');
    console.log('      ESSENS_PASSWORT="euer-passwort" npm start');
  }
  console.log('  Beenden mit:         Strg + C\n');
});
