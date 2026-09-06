/**
 * Prueft schema.sql und seed.sql gegen ein echtes PostgreSQL.
 *
 * Aufruf:
 *   npm install --no-save embedded-postgres     (einmalig, ca. 100 MB)
 *   npm run test:db
 *
 * Startet eine eigene Datenbank im temporaeren Ordner, spielt beide SQL-Dateien
 * ein und prueft unter anderem, dass eine Familie keine Daten einer anderen
 * Familie sehen oder aendern kann.
 */
import EmbeddedPostgres from 'embedded-postgres';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = fileURLToPath(new URL('..', import.meta.url));
const results = [];
const ok = (name, detail = '') => results.push(`  ✅ ${name}${detail ? ' — ' + detail : ''}`);
const fail = (name, detail) => results.push(`  ❌ ${name} — ${detail}`);

const pg = new EmbeddedPostgres({
  databaseDir: mkdtempSync(join(tmpdir(), 'essens-app-db-')),
  user: 'postgres',
  password: 'postgres',
  port: 54329,
  persistent: false,
});

await pg.initialise();
await pg.start();
const db = pg.getPgClient();
await db.connect();

try {
  // --- Supabase-Umgebung nachbauen: auth-Schema, Rollen, Standardrechte ---
  await db.query(`
    create schema if not exists auth;
    create table auth.users (
      id uuid primary key default gen_random_uuid(),
      email text,
      raw_user_meta_data jsonb not null default '{}'::jsonb
    );
    create or replace function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create role anon nologin;
    create role authenticated nologin;
    grant usage on schema auth to anon, authenticated;
  `);

  // --- 1. Schema einspielen ---
  await db.query(readFileSync(`${APP}supabase/schema.sql`, 'utf8'));
  ok('schema.sql läuft fehlerfrei durch');

  const tables = await db.query(
    `select table_name from information_schema.tables where table_schema='public' order by 1`,
  );
  ok('Tabellen angelegt', `${tables.rowCount}: ${tables.rows.map((r) => r.table_name).join(', ')}`);

  const rls = await db.query(
    `select count(*)::int as n from pg_tables where schemaname='public' and rowsecurity = false`,
  );
  if (rls.rows[0].n === 0) ok('Zugriffsschutz (RLS) auf allen Tabellen aktiv');
  else fail('Zugriffsschutz', `${rls.rows[0].n} Tabelle(n) ohne RLS`);

  // --- 2. Grunddaten einspielen ---
  await db.query(readFileSync(`${APP}supabase/seed.sql`, 'utf8'));
  const counts = await db.query(`
    select (select count(*) from ingredients) as zutaten,
           (select count(*) from recipes) as rezepte,
           (select count(*) from recipe_ingredients) as rezeptzutaten,
           (select count(*) from recipes where one_pot) as onepot`);
  const c = counts.rows[0];
  ok('seed.sql läuft fehlerfrei durch',
     `${c.zutaten} Zutaten, ${c.rezepte} Rezepte (${c.onepot} One Pot), ${c.rezeptzutaten} Rezeptzutaten`);

  // Zweimal ausführen darf nichts kaputt machen
  await db.query(readFileSync(`${APP}supabase/seed.sql`, 'utf8'));
  const again = await db.query(`select count(*)::int as n from recipes`);
  if (again.rows[0].n === Number(c.rezepte)) ok('seed.sql ist mehrfach ausführbar', 'keine Dubletten');
  else fail('seed.sql mehrfach ausführbar', `${again.rows[0].n} statt ${c.rezepte} Rezepte`);

  // --- 3. Automatischer Haushalt beim ersten Anmelden ---
  const u1 = await db.query(
    `insert into auth.users (email, raw_user_meta_data) values ('mama@example.com', '{"name":"Mama"}') returning id`,
  );
  const u2 = await db.query(`insert into auth.users (email) values ('fremde@example.com') returning id`);
  const userA = u1.rows[0].id;
  const userB = u2.rows[0].id;
  const prof = await db.query(`select household_id from profiles where id = $1`, [userA]);
  if (prof.rowCount === 1) ok('Neues Konto bekommt automatisch einen Haushalt');
  else fail('Automatischer Haushalt', 'kein Profil angelegt');
  const householdA = prof.rows[0].household_id;
  const householdB = (await db.query(`select household_id from profiles where id=$1`, [userB])).rows[0].household_id;

  // Zweites Familienmitglied demselben Haushalt zuordnen
  const u3 = await db.query(`insert into auth.users (email) values ('papa@example.com') returning id`);
  const userC = u3.rows[0].id;
  await db.query(`update profiles set household_id = $1 where id = $2`, [householdA, userC]);

  // Testdaten für beide Haushalte
  await db.query(`insert into favorites (household_id, recipe_id, created_by) values ($1,'one-pot-bolognese-nudeln',$2)`, [householdA, userA]);
  await db.query(`insert into favorites (household_id, recipe_id, created_by) values ($1,'one-pot-linsen-kokos-curry',$2)`, [householdB, userB]);
  await db.query(`insert into shopping_lists (household_id) values ($1)`, [householdA]);

  // --- 4. Zugriffsschutz aus Sicht angemeldeter Nutzer ---
  const asUser = async (uid, sql, params) => {
    await db.query(`set local role authenticated`);
    await db.query(`select set_config('request.jwt.claim.sub', $1, true)`, [uid]);
    const r = await db.query(sql, params);
    await db.query(`reset role`);
    return r;
  };

  await db.query('begin');
  const eigene = await asUser(userA, `select recipe_id from favorites`);
  await db.query('commit');
  if (eigene.rowCount === 1 && eigene.rows[0].recipe_id === 'one-pot-bolognese-nudeln')
    ok('Familie sieht nur die eigenen Favoriten', 'fremder Haushalt bleibt unsichtbar');
  else fail('Trennung der Haushalte', `${eigene.rowCount} Favoriten sichtbar`);

  await db.query('begin');
  const partner = await asUser(userC, `select recipe_id from favorites`);
  await db.query('commit');
  if (partner.rowCount === 1) ok('Zweites Familienmitglied sieht dieselben Daten');
  else fail('Gemeinsamer Haushalt', `${partner.rowCount} Favoriten sichtbar`);

  await db.query('begin');
  const listen = await asUser(userB, `select id from shopping_lists`);
  await db.query('commit');
  if (listen.rowCount === 0) ok('Fremde Einkaufsliste ist nicht lesbar');
  else fail('Fremde Einkaufsliste', `${listen.rowCount} Listen sichtbar`);

  // Schreiben in einen fremden Haushalt muss scheitern
  await db.query('begin');
  try {
    await asUser(userB, `insert into favorites (household_id, recipe_id) values ($1,'one-pot-chili-sin-carne')`, [householdA]);
    fail('Schreibschutz', 'fremder Haushalt konnte beschrieben werden');
  } catch {
    ok('Schreiben in fremde Haushalte wird abgewiesen');
  }
  await db.query('rollback');

  // Rezepte: mitgelieferte für alle lesbar
  await db.query('begin');
  const rezepte = await asUser(userB, `select count(*)::int as n from recipes`);
  await db.query('commit');
  if (rezepte.rows[0].n === 30) ok('Alle 30 Rezepte sind für jede Familie lesbar');
  else fail('Rezeptzugriff', `${rezepte.rows[0].n} Rezepte sichtbar`);

  // --- 5. Einkaufsliste rechnet Zutaten auf Datenbankebene zusammen ---
  const listId = (await db.query(`select id from shopping_lists where household_id=$1`, [householdA])).rows[0].id;
  await db.query(`insert into shopping_list_items (list_id, ingredient_id, amount, unit) values ($1,'zwiebel',2,'Stk')`, [listId]);
  try {
    await db.query(`insert into shopping_list_items (list_id, ingredient_id, amount, unit) values ($1,'zwiebel',3,'Stk')`, [listId]);
    fail('Zusammenrechnen', 'Zutat konnte doppelt angelegt werden');
  } catch {
    ok('Datenbank verhindert doppelte Positionen', 'gleiche Zutat + Einheit nur einmal je Liste');
  }
  await db.query(`update shopping_list_items set amount = amount + 3 where list_id=$1 and ingredient_id='zwiebel'`, [listId]);
  const menge = await db.query(`select amount from shopping_list_items where list_id=$1 and ingredient_id='zwiebel'`, [listId]);
  if (Number(menge.rows[0].amount) === 5) ok('Mengen addieren sich korrekt', '2 + 3 = 5 Zwiebeln');
  else fail('Mengen', `${menge.rows[0].amount} statt 5`);

  // --- 6. Wochenplan: ein Rezept je Tag und Mahlzeit ---
  const plan = await db.query(`insert into weekly_plans (household_id, week_start) values ($1,'2026-09-07') returning id`, [householdA]);
  const planId = plan.rows[0].id;
  await db.query(`insert into weekly_plan_items (plan_id, day, slot, recipe_id, servings) values ($1,'mo','abend','one-pot-bolognese-nudeln',4)`, [planId]);
  try {
    await db.query(`insert into weekly_plan_items (plan_id, day, slot, recipe_id, servings) values ($1,'mo','abend','one-pot-chili-sin-carne',4)`, [planId]);
    fail('Wochenplan', 'Montagabend konnte doppelt belegt werden');
  } catch {
    ok('Wochenplan: je Tag und Mahlzeit nur ein Rezept');
  }
  try {
    await db.query(`insert into weekly_plan_items (plan_id, day, slot, recipe_id) values ($1,'montag','abend','one-pot-bolognese-nudeln')`, [planId]);
    fail('Prüfregeln', 'ungültiger Wochentag wurde angenommen');
  } catch {
    ok('Ungültige Wochentage werden abgewiesen');
  }
  try {
    await db.query(`insert into ratings (household_id, recipe_id, stars) values ($1,'one-pot-bolognese-nudeln',9)`, [householdA]);
    fail('Prüfregeln', '9 Sterne wurden angenommen');
  } catch {
    ok('Bewertungen sind auf 1–5 Sterne begrenzt');
  }
} catch (e) {
  fail('Unerwarteter Fehler', e.message);
} finally {
  console.log('\n=== Ergebnis Datenbank-Schema ===');
  console.log(results.join('\n'));
  console.log(`\n${results.filter((r) => r.includes('✅')).length} bestanden, ${results.filter((r) => r.includes('❌')).length} fehlgeschlagen`);
  await db.end();
  await pg.stop();
}
process.exitCode = results.some((r) => r.includes('❌')) ? 1 : 0;
