# Essens App

Familien-Rezept-App für Gerichte **ohne zugesetzten Zucker** und **ohne Fisch**,
optimiert für 2 Erwachsene + 2 Kinder. Mobile First.

## App starten

```bash
cd essens-app
npm install
npm start
```

`npm start` baut die App und startet den Familien-Server. Im Terminal stehen dann
zwei Adressen — die zweite am Handy öffnen (gleiches WLAN):

```
Auf diesem Rechner:  http://localhost:5190
Im WLAN (Handy):     http://192.168.x.x:5190
```

Am Handy einmal über das Teilen-Menü „Zum Home-Bildschirm" wählen — danach
startet die App wie eine normale App und funktioniert auch ohne Empfang.

Solange der Server läuft, sehen **alle Geräte dieselben Daten**: dieselbe
Einkaufsliste, dieselben Favoriten, denselben Wochenplan. Ohne Konto, ohne Cloud,
ohne Fremdanbieter — alles bleibt auf eurem Rechner
(siehe [server/README.md](server/README.md)).

Soll die App rund um die Uhr und von unterwegs erreichbar sein, gehört ein
Passwort davor:

```bash
ESSENS_PASSWORT="euer-familienpasswort" npm start
```

Alles Weitere dazu — automatischer Start, Sicherung — steht in
[server/BETRIEB.md](server/BETRIEB.md).
Für den Zugriff von unterwegs: [server/BETRIEB-ONLINE.md](server/BETRIEB-ONLINE.md).

Zum Programmieren gibt es zusätzlich `npm run dev` (Port 5180, lädt Änderungen
sofort nach; dabei ist der Geräte-Abgleich aus).

Weitere Befehle:

| Befehl | Zweck |
| --- | --- |
| `npm start` | App bauen und Familien-Server starten (der Normalfall) |
| `npm run dev` | Entwicklungsserver mit Live-Reload (zum Programmieren) |
| `npm test` | Tests der Kernlogik (Portionen, Einkaufsliste, Wochenplan) |
| `npm run typecheck` | Prüft die Typen |
| `npm run build` | Fertige Version für die Veröffentlichung (Ordner `dist/`) |
| `npm run preview` | Die fertige Version lokal ansehen (mit Offline-Funktion) |
| `npm run seed` | Erzeugt `supabase/seed.sql` neu aus den Rezeptdaten |
| `npm run test:server` | Prüft den Familien-Server: Anmeldung und Zugriffsschutz |
| `npm run test:db` | Prüft das Datenbankschema gegen echtes PostgreSQL |

## Was die App kann

- **Startseite** mit „Was möchtest du heute essen?“, Suchfeld mit Live-Vorschlägen
  und den vier Kacheln Rezepte / Lecker / Einkaufsliste / Wochenplan
- **89 Rezepte**, davon 41 One-Pot-Gerichte, 37 glutenfreie und 15 Frühstücksideen — alle ohne zugesetzten Zucker und ohne Fisch
- **📷 Eigene Rezepte hinzufügen**: Foto oder PDF hochladen — die App liest Titel,
  Zutaten und Zubereitung automatisch heraus (Texterkennung läuft komplett im
  Browser, es wird nichts hochgeladen). Vor dem Speichern wird alles in einem
  Formular angezeigt und lässt sich korrigieren. Eigene Rezepte tauchen
  gleichwertig neben den mitgelieferten auf, ihre Zutaten zählen bei der
  Einkaufsliste ganz normal mit
- **🔗 Rezept aus einem Link**: YouTube-Video oder Rezept-Webseite einfügen.
  Läuft der Familien-Server, liest er die Seite selbst (dort erlaubt, anders als
  im Browser) — bei den meisten Rezept-Webseiten sogar mit exakten Zutaten,
  Mengen, Zubereitung, Bild, Portionen und Nährwerten, weil viele Seiten das für
  Google-Suchergebnisse extra bereitstellen. Ohne Server bleibt bei YouTube
  wenigstens Titel/Vorschaubild automatisch (eine öffentliche Schnittstelle ganz
  ohne Server), bei anderen Seiten bleibt dann nur die Handeingabe
- **Rezeptdetails** mit Nährwerten, Zutaten, Schritt-für-Schritt-Anleitung (Schritte
  lassen sich beim Kochen abhaken) und Portionsrechner
- **Portionen ändern**: alle Mengen werden automatisch umgerechnet und
  küchentauglich gerundet (z. B. 400 g → 600 g, 1 Stk → 1½ Stk)
- **❤️ Lecker**: Favoriten, bleiben nach dem Neustart erhalten
- **⭐ Bewertungen**: 1–5 Sterne, „Hat es den Kindern geschmeckt?“ und Kommentar
- **🛒 Einkaufsliste**: gleiche Zutaten aus mehreren Rezepten werden automatisch
  zusammengerechnet (2 Zwiebeln + 3 Zwiebeln = 5 Zwiebeln), nach Supermarkt-
  Abteilungen sortiert, mit Checkboxen; Vorratszutaten lassen sich ausblenden
- **📅 Wochenplan**: Montag bis Sonntag, je Tag Frühstück/Mittag/Abend, plus
  „Wocheneinkauf erstellen“ — überträgt alle Rezepte der Woche in eine Liste
- **Filter & Suche**: Favoriten, Kinderfreundlich, One Pot, Hähnchen, Hackfleisch,
  Vegetarisch, unter 20/30 Minuten, Proteinreich, Pasta, Reis, Kartoffeln,
  Auflauf, Frühstück + Textsuche
- **Liste teilen**: Einkaufsliste als Text an WhatsApp & Co. weitergeben, damit
  auch jemand anderes einkaufen kann
- **⚙️ Einstellungen**: Familiengröße (bestimmt die Standard-Portionen),
  Datensicherung zum Speichern und Wiedereinspielen, Anleitung fürs Handy
- **Als App aufs Handy**: installierbar über den Homescreen, läuft danach auch
  ohne Internet (Rezepte, Einkaufsliste und Wochenplan sind offline verfügbar)
- **🔄 Geräte-Abgleich**: alle Geräte im Heimnetz teilen sich denselben Stand.
  Was ohne Verbindung geändert wurde, wird später automatisch nachgetragen und
  zusammengeführt — ohne dass etwas verloren geht

## Technik

React + TypeScript + Vite, React Router, handgeschriebenes CSS-Design-System.
Bewusst wenige Abhängigkeiten, damit die App einfach zu betreiben und
weiterzuentwickeln ist.

```
essens-app/
├── index.html
├── src/
│   ├── main.tsx              Einstiegspunkt
│   ├── App.tsx               Routen
│   ├── index.css             Design-System (Farben, Karten, Navigation)
│   ├── types/index.ts        Datenmodell (Recipes, Ingredients, Favorites, …)
│   ├── data/
│   │   ├── ingredients.ts    Zutaten-Stammdaten + Supermarkt-Abteilungen
│   │   └── recipes.ts        89 Rezepte
│   ├── lib/
│   │   ├── quantity.ts       Portionen skalieren, Einheiten, Formatierung
│   │   ├── shopping.ts       Einkaufsliste: Zusammenrechnen, Gruppieren, Teilen
│   │   ├── filters.ts        Filter und Textsuche
│   │   ├── recipes.ts        Mitgelieferte + eigene Rezepte zusammenführen
│   │   ├── youtube.ts        YouTube-Link erkennen, Titel/Vorschaubild ohne Server
│   │   ├── textExtraction.ts Text aus Foto/PDF lesen (Tesseract.js, pdf.js)
│   │   ├── recipeTextStructure.ts  Erkannten Text in Titel/Zutaten/Schritte teilen
│   │   ├── ingredientParsing.ts    Freitext-Zutat → strukturierte Zutat
│   │   ├── imageResize.ts    Fotos vor dem Speichern verkleinern
│   │   ├── storage.ts        Speicher-Schicht (heute localStorage)
│   │   ├── backup.ts         Datensicherung exportieren/einlesen
│   │   ├── sync.ts           Zusammenführen zweier Geräte-Stände
│   │   ├── syncClient.ts     Verbindung zum Familien-Server
│   │   ├── text.ts           Sprachhilfen (Singular/Plural)
│   │   ├── sql.ts            Hilfen zum Erzeugen der Datenbankdatei
│   │   └── ai.ts             KI-Anbindung (vorbereitet)
│   ├── store/
│   │   ├── AppContext.ts     Zustandstypen + useApp()
│   │   └── AppProvider.tsx   Zustand & alle Aktionen
│   ├── components/           RecipeCard, Sheet, BottomNav, Sterne, Toast
│   └── pages/                Home, Rezepte, Detail, Rezept hinzufügen, Lecker,
│                             Einkauf, Woche, Einstellungen
├── public/                   App-Icons für den Homescreen
├── scripts/generate-seed.ts  Erzeugt die Datenbankdatei aus den Rezepten
├── server/
│   ├── serve.mjs             Familien-Server (nur eingebautes Node)
│   ├── sicheresFetch.mjs     Ruft Links sicher ab (SSRF-Schutz)
│   ├── rezeptImport.mjs      Liest Zutaten/Zubereitung aus Webseite/YouTube
│   ├── README.md             Wie der Abgleich funktioniert
│   ├── BETRIEB.md            Dauerbetrieb im Heimnetz
│   ├── BETRIEB-ONLINE.md     Zugriff von unterwegs (Wege, Kosten, Sicherheit)
│   ├── test-server.mjs       22 Prüfungen der Anmeldung und Absicherung
│   ├── sicheresFetch.test.mjs, rezeptImport.test.mjs  27 weitere Prüfungen
│   └── betrieb/              Vorlagen: systemd, launchd, HTTPS (Caddy)
├── supabase/                 Optional: Datenbank in der Cloud (nicht nötig)
└── test/                     114 Tests der Kernlogik (Rezepte, Einkaufsliste,
                              Zutaten-Erkennung, Text-Erkennung, Geräte-Abgleich)
```

### Wo werden die Daten gespeichert?

Aktuell im Browser des Geräts (`localStorage`). Die gesamte App spricht nur über
`StateRepository` in `src/lib/storage.ts` mit dem Speicher. Um später auf eine
echte Datenbank zu wechseln, wird nur eine zweite Implementierung dieses
Interfaces geschrieben — die Oberfläche bleibt unverändert.

Läuft zusätzlich der Familien-Server (`npm start`), schickt jedes Gerät seinen
Stand dorthin und holt sich die Änderungen der anderen. Der Server speichert
alles in `server/daten/stand.json` auf eurem eigenen Rechner.

**Sichere trotzdem gelegentlich:** Unter *Einstellungen → Daten sichern* gibt es
eine Sicherungsdatei. Sie ist die Absicherung, wenn ein Gerät verloren geht oder
die Browserdaten gelöscht werden.

### Und wenn es später doch eine Cloud sein soll?

In [`supabase/`](supabase/README.md) liegt ein fertiges, gegen echtes PostgreSQL
getestetes Datenbankschema (`npm run test:db`) — für den Fall, dass die App
einmal auch außerhalb des Heimnetzes synchron sein soll. **Nötig ist das nicht:**
Für eine Familie reicht der eigene Server vollkommen.

### Vorbereitet, aber noch nicht aktiv

- **KI-Funktionen (Claude):** `src/lib/ai.ts` ruft ausschließlich einen eigenen
  Backend-Endpunkt auf. Der Anthropic-API-Schlüssel gehört ausschließlich auf den
  Server und niemals ins Frontend (siehe `server/README.md`).
- **Bestellfunktion:** Zutaten tragen bereits Felder für Händlerprodukte
  (`gtin`, `vendorRefs` in `src/types/index.ts`), und Mengen werden in
  Basiseinheiten (g/ml/Stück) gespeichert — das ist die Grundlage dafür, die
  Liste später an einen Lieferdienst zu übergeben.

## Rezepte ergänzen

**Der einfachste Weg:** In der App auf **Rezepte → +** (oder auf der Startseite
„Eigenes Rezept per Foto oder PDF hinzufügen“) tippen, ein Foto oder eine PDF-Datei
auswählen. Die Texterkennung läuft direkt im Browser — es wird nichts
hochgeladen — und befüllt ein Formular mit Titel, Zutaten und Zubereitung, das
sich vor dem Speichern noch korrigieren lässt.

Dabei versucht die App, jede Zutatenzeile einer bekannten Zutat zuzuordnen
(auch bei anderen Namen wie „Karotte“ statt „Möhre“ — siehe
`src/lib/ingredientParsing.ts`), damit gleiche Zutaten in der Einkaufsliste
weiterhin richtig zusammengerechnet werden. Was nicht erkannt wird, legt die
App als neue Zutat an; unbekannte Nährwerte werden ehrlich als „unbekannt“
angezeigt statt geraten. Eigene Rezepte lassen sich auf ihrer Detailseite über
„Eigenes Rezept löschen“ wieder entfernen.

**Für mitgelieferte Rezepte** (die 30 fest in der App enthaltenen): Diese kommen
in `src/data/recipes.ts`. Ein Rezept braucht eine eindeutige `id`, Mengen für
`baseServings: 4` und nur Zutaten, deren `id` in `src/data/ingredients.ts`
existiert. Die Tests prüfen das automatisch:

```bash
npm test
```

Für echte Fotos statt der Emoji-Platzhalter: Bild in `public/` legen und im
Rezept `image: '/mein-bild.jpg'` ergänzen.
