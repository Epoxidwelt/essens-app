/**
 * Prüft den Familien-Server: Anmeldung, Zugriffsschutz, Datenhaltung.
 *
 * Aufruf:  npm run test:server
 *
 * Startet den Server in einem temporären Ordner auf einem freien Port,
 * spricht ihn über echte HTTP-Anfragen an und räumt danach auf.
 * Ohne Fremdbibliotheken.
 */
import { spawn } from 'node:child_process';
import { connect } from 'node:net';
import { mkdtempSync, rmSync, cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJEKT = fileURLToPath(new URL('..', import.meta.url));
const PORT = 5199;
const BASIS = `http://127.0.0.1:${PORT}`;
const PASSWORT = 'GeheimesFamilienpasswort';

const ergebnisse = [];
const ok = (name, detail = '') => ergebnisse.push(`  ✅ ${name}${detail ? ' — ' + detail : ''}`);
const fail = (name, detail) => ergebnisse.push(`  ❌ ${name} — ${detail}`);

function pruefe(name, bedingung, detail = '') {
  if (bedingung) ok(name, detail);
  else fail(name, detail || 'Bedingung nicht erfüllt');
}

// Arbeitskopie, damit der echte Datenordner unberührt bleibt.
const arbeitsordner = mkdtempSync(join(tmpdir(), 'essens-server-test-'));
mkdirSync(join(arbeitsordner, 'server'), { recursive: true });
mkdirSync(join(arbeitsordner, 'dist'), { recursive: true });
cpSync(join(PROJEKT, 'server', 'serve.mjs'), join(arbeitsordner, 'server', 'serve.mjs'));
writeFileSync(join(arbeitsordner, 'dist', 'index.html'), '<h1>Testseite</h1>', 'utf8');

const server = spawn(process.execPath, ['server/serve.mjs'], {
  cwd: arbeitsordner,
  env: { ...process.env, PORT: String(PORT), ESSENS_PASSWORT: PASSWORT },
  stdio: ['ignore', 'pipe', 'pipe'],
});

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/** Schickt eine unveränderte HTTP-Zeile – nötig, um Pfad-Tricks zu prüfen. */
function roheAnfrage(startzeile) {
  return new Promise((aufloesen, ablehnen) => {
    const socket = connect(PORT, '127.0.0.1', () => {
      socket.write(`${startzeile}\r\nHost: 127.0.0.1:${PORT}\r\nConnection: close\r\n\r\n`);
    });
    let antwort = '';
    socket.setTimeout(5000, () => {
      socket.destroy();
      ablehnen(new Error('Zeitüberschreitung'));
    });
    socket.on('data', (teil) => {
      antwort += teil.toString('utf8');
    });
    socket.on('end', () => aufloesen(antwort));
    socket.on('error', ablehnen);
  });
}

async function erreichbar() {
  for (let versuch = 0; versuch < 40; versuch += 1) {
    try {
      const res = await fetch(`${BASIS}/api/status`);
      if (res.ok) return true;
    } catch {
      /* noch nicht da */
    }
    await warte(150);
  }
  return false;
}

try {
  if (!(await erreichbar())) throw new Error('Server ist nicht gestartet');
  ok('Server startet');

  // --- Status ist öffentlich und verrät, dass ein Passwort nötig ist ---
  const status = await (await fetch(`${BASIS}/api/status`)).json();
  pruefe('Status meldet Passwortschutz', status.geschuetzt === true && status.version === 0);

  // --- Ohne Anmeldung kein Zugriff ---
  const ohne = await fetch(`${BASIS}/api/stand`);
  pruefe('Lesen ohne Anmeldung wird abgewiesen', ohne.status === 401, `Antwort ${ohne.status}`);

  const schreibenOhne = await fetch(`${BASIS}/api/stand`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: { boshaft: true } }),
  });
  pruefe('Schreiben ohne Anmeldung wird abgewiesen', schreibenOhne.status === 401, `Antwort ${schreibenOhne.status}`);

  // --- Falsches Passwort ---
  const falsch = await fetch(`${BASIS}/api/anmelden`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passwort: 'raten123' }),
  });
  pruefe('Falsches Passwort wird abgewiesen', falsch.status === 401);

  // Auch ein Passwort mit gleichem Anfang darf nicht durchrutschen.
  const teilweise = await fetch(`${BASIS}/api/anmelden`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passwort: PASSWORT.slice(0, -1) }),
  });
  pruefe('Fast richtiges Passwort wird abgewiesen', teilweise.status === 401);

  // --- Richtiges Passwort ---
  const anmeldung = await fetch(`${BASIS}/api/anmelden`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passwort: PASSWORT }),
  });
  const { token } = await anmeldung.json();
  pruefe('Richtiges Passwort liefert eine Zugangsmarke', typeof token === 'string' && token.length === 64);

  const kopf = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // --- Erfundene Marke ---
  const erfunden = await fetch(`${BASIS}/api/stand`, { headers: { Authorization: 'Bearer aaaabbbb' } });
  pruefe('Erfundene Zugangsmarke wird abgewiesen', erfunden.status === 401);

  // --- Lesen und Schreiben mit Anmeldung ---
  const leer = await (await fetch(`${BASIS}/api/stand`, { headers: kopf })).json();
  pruefe('Frischer Server hat noch keinen Stand', leer.version === 0 && leer.state === null);

  const schreiben = await fetch(`${BASIS}/api/stand`, {
    method: 'PUT',
    headers: kopf,
    body: JSON.stringify({ state: { favorites: [{ recipeId: 'test' }] } }),
  });
  const geschrieben = await schreiben.json();
  pruefe('Stand lässt sich speichern', schreiben.ok && geschrieben.version === 1);

  const gelesen = await (await fetch(`${BASIS}/api/stand`, { headers: kopf })).json();
  pruefe(
    'Gespeicherter Stand kommt unverändert zurück',
    gelesen.state?.favorites?.[0]?.recipeId === 'test' && gelesen.version === 1,
  );

  // --- Versionszähler ---
  await fetch(`${BASIS}/api/stand`, { method: 'PUT', headers: kopf, body: JSON.stringify({ state: { a: 2 } }) });
  const status2 = await (await fetch(`${BASIS}/api/status`)).json();
  pruefe('Jede Änderung erhöht die Version', status2.version === 2, `Version ${status2.version}`);

  // --- Ungültige Anfragen ---
  const kaputt = await fetch(`${BASIS}/api/stand`, { method: 'PUT', headers: kopf, body: 'kein json' });
  pruefe('Fehlerhafte Anfragen werden sauber abgewiesen', kaputt.status === 400);

  const ohneStand = await fetch(`${BASIS}/api/stand`, { method: 'PUT', headers: kopf, body: JSON.stringify({}) });
  pruefe('Anfrage ohne Stand wird abgewiesen', ohneStand.status === 400);

  // --- Keine fremden Dateien ausliefern ---
  // fetch() bereinigt Pfade selbst, deshalb hier eine rohe Anfrage:
  // so kommt der Ausbruchsversuch wirklich beim Server an.
  const rohAntwort = await roheAnfrage('GET /../../../package.json HTTP/1.1');
  pruefe(
    'Ausbruch aus dem App-Ordner scheitert (roher Pfad)',
    !rohAntwort.includes('"dependencies"') && !rohAntwort.includes('essens-app@'),
    rohAntwort.split('\r\n')[0],
  );

  const rohEncoded = await roheAnfrage('GET /%2e%2e/%2e%2e/package.json HTTP/1.1');
  pruefe(
    'Ausbruch mit verschleiertem Pfad scheitert',
    !rohEncoded.includes('"dependencies"'),
    rohEncoded.split('\r\n')[0],
  );

  const rohDaten = await roheAnfrage('GET /../server/daten/sitzungen.json HTTP/1.1');
  pruefe(
    'Sitzungsdatei ist nicht abrufbar',
    !rohDaten.includes('token'),
    rohDaten.split('\r\n')[0],
  );

  // --- Schutzköpfe ---
  const seite = await fetch(`${BASIS}/`);
  pruefe(
    'Schutzköpfe werden mitgeschickt',
    seite.headers.get('x-content-type-options') === 'nosniff' &&
      seite.headers.get('x-frame-options') === 'SAMEORIGIN',
  );
  pruefe(
    'Keine Freigabe für fremde Herkünfte',
    seite.headers.get('access-control-allow-origin') === null,
  );

  // --- Alle Geräte abmelden ---
  const abmelden = await fetch(`${BASIS}/api/sitzungen`, { method: 'DELETE', headers: kopf });
  pruefe('Alle Geräte lassen sich abmelden', abmelden.ok);
  const danach = await fetch(`${BASIS}/api/stand`, { headers: kopf });
  pruefe('Nach dem Abmelden ist die alte Marke ungültig', danach.status === 401);

  // --- Bremse gegen Passwortraten ---
  let gesperrt = false;
  for (let i = 0; i < 12; i += 1) {
    const res = await fetch(`${BASIS}/api/anmelden`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwort: `versuch-${i}` }),
    });
    if (res.status === 429) {
      gesperrt = true;
      break;
    }
  }
  pruefe('Wiederholtes Raten wird gesperrt', gesperrt);
} catch (e) {
  fail('Unerwarteter Fehler', e instanceof Error ? e.message : String(e));
} finally {
  server.kill();
  rmSync(arbeitsordner, { recursive: true, force: true });

  const bestanden = ergebnisse.filter((r) => r.includes('✅')).length;
  const durchgefallen = ergebnisse.filter((r) => r.includes('❌')).length;
  console.log('\n=== Familien-Server ===');
  console.log(ergebnisse.join('\n'));
  console.log(`\n${bestanden} bestanden, ${durchgefallen} fehlgeschlagen`);
  process.exitCode = durchgefallen > 0 ? 1 : 0;
}
