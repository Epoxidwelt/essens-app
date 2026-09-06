# Datenbank (Supabase) – Anleitung

Diese Dateien sind der **nächste Schritt**: Sobald du sie einspielst, können
mehrere Geräte dieselben Daten nutzen. Die App läuft heute auch ohne das hier —
sie speichert dann weiterhin nur auf dem jeweiligen Gerät.

| Datei | Inhalt |
| --- | --- |
| `schema.sql` | Alle Tabellen und der Zugriffsschutz |
| `seed.sql` | Die 97 Zutaten und 30 Rezepte (automatisch erzeugt) |
| `test-schema.mjs` | Prüft beide Dateien gegen ein echtes PostgreSQL |

**Beide Dateien sind getestet.** Sie wurden gegen eine echte PostgreSQL-Datenbank
eingespielt; 16 Prüfungen laufen durch — unter anderem, dass eine Familie die
Daten einer anderen Familie weder sehen noch ändern kann. Selbst nachprüfen:

```bash
npm install --no-save embedded-postgres   # einmalig, ca. 100 MB
npm run test:db
```

## Einrichten in 5 Schritten

1. Auf [supabase.com](https://supabase.com) kostenlos anmelden und ein neues
   Projekt anlegen. Region: Frankfurt (EU).
2. Im Projekt links auf **SQL Editor** klicken, den kompletten Inhalt von
   `schema.sql` einfügen und auf **Run** klicken.
3. Dasselbe mit `seed.sql`. Danach stehen Zutaten und Rezepte in der Datenbank.
4. Unter **Project Settings → API** findest du zwei Werte: die *Project URL* und
   den *anon public key*. Beide gehören in eine neue Datei `.env.local` im
   Ordner `essens-app`:

   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

   Diese Datei ist bereits von Git ausgeschlossen und gehört **nicht** ins
   Repository.
5. Danach wird in der App die Anmeldung ergänzt und `src/lib/storage.ts` um eine
   zweite Umsetzung (`SupabaseRepository`) erweitert. Erst dieser Schritt schaltet
   die Datenbank scharf.

> Der `anon key` ist für den Einsatz im Browser gedacht und darf öffentlich sein.
> Geschützt werden die Daten durch die Regeln in `schema.sql` (Row Level
> Security). Der **service_role key** dagegen darf niemals in die App — er umgeht
> alle Regeln und gehört ausschließlich auf einen Server.

## Wie die Daten aufgebaut sind

Alles hängt an einem **Haushalt**, nicht an einer einzelnen Person:

```
households ── profiles (ein Anmeldekonto je Familienmitglied)
     │
     ├── favorites          (Lecker)
     ├── ratings            (Sterne, "hat den Kindern geschmeckt")
     ├── shopping_lists ── shopping_list_items
     ├── weekly_plans   ── weekly_plan_items
     └── recipes (eigene)   ← später auch von Claude erzeugte Rezepte

recipes (mitgeliefert, household_id = NULL) ── recipe_ingredients ── ingredients
```

Dadurch sehen beide Erwachsene automatisch dieselbe Einkaufsliste und denselben
Wochenplan — ohne dass etwas manuell geteilt werden muss.

Zwei Details, die später wichtig werden:

- `shopping_list_items` hat eine Eindeutigkeitsregel auf
  `(list_id, ingredient_id, unit)`. Damit erzwingt schon die Datenbank, dass
  gleiche Zutaten zusammengerechnet werden.
- `ingredients.gtin` und `ingredients.vendor_refs` sind die Anknüpfungspunkte für
  die spätere Bestellfunktion bei einem Lieferdienst.

## Rezepte ändern

Rezepte werden weiterhin in `src/data/recipes.ts` gepflegt. Danach:

```bash
npm run seed
```

Das schreibt `supabase/seed.sql` neu. Diese Datei erneut im SQL Editor ausführen —
vorhandene Rezepte werden dabei aktualisiert, nichts geht verloren.
