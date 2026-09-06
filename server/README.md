# Familien-Server

Der Server macht aus der App eine echte Familien-App: Alle Geräte im WLAN sehen
dieselben Favoriten, dieselbe Einkaufsliste und denselben Wochenplan.

**Ohne Konto, ohne Cloud, ohne Fremdanbieter.** Der Server ist eine einzige
Datei (`serve.mjs`), benutzt ausschließlich eingebautes Node und speichert alles
in `server/daten/stand.json` auf eurem eigenen Rechner. Es verlässt nichts das Haus.

## Starten

```bash
npm start
```

Damit die App rund um die Uhr läuft — auch wenn dein Arbeitsrechner aus ist —
gibt es ein Einrichtungsskript für ein kleines Gerät im Heimnetz
(Raspberry Pi, alter Laptop, NAS):

```bash
bash server/betrieb/einrichten.sh
```

Alles dazu, inklusive Kosten und Stolperfallen: **[BETRIEB.md](BETRIEB.md)**.

Das baut die App und startet den Server. Im Terminal erscheinen zwei Adressen:

```
Auf diesem Rechner:  http://localhost:5190
Im WLAN (Handy):     http://192.168.x.x:5190
```

Die zweite Adresse am Handy öffnen (gleiches WLAN) und über das Teilen-Menü zum
Home-Bildschirm hinzufügen. Fertig.

Beenden mit `Strg + C`. Solange der Server aus ist, arbeitet jedes Gerät einfach
für sich weiter — nichts geht verloren, es wird beim nächsten Start nachgeholt.

## Wie der Abgleich funktioniert

Jedes Gerät speichert weiterhin alles bei sich (die App funktioniert auch ohne
Empfang). Zusätzlich schickt es seinen Stand an den Server und fragt alle paar
Sekunden nach, ob ein anderes Gerät etwas geändert hat. Sobald die App wieder in
den Vordergrund kommt, wird sofort abgeglichen.

Ändern zwei Geräte gleichzeitig etwas, wird zusammengeführt statt überschrieben
(`src/lib/sync.ts`):

| Bereich | Regel |
| --- | --- |
| Favoriten, Bewertungen | beide Seiten behalten — es geht nie etwas verloren |
| Einkaufsliste | gleiche Zutat wird zusammengefasst; **abgehakt** schlägt offen, die **größere Menge** gewinnt |
| Wochenplan | je Tag und Mahlzeit ein Rezept; der eigene Eintrag gewinnt |

Die Regel „abgehakt gewinnt" ist Absicht: Wer im Laden etwas abhakt, hat es im
Einkaufswagen — das soll zu Hause nicht wieder aufpoppen.

**Bewusste Einschränkung:** Wenn zwei Geräte gleichzeitig arbeiten und eines
etwas löscht, kann der gelöschte Eintrag wieder auftauchen. Das ist der Preis
dafür, dass niemals versehentlich Daten verschwinden.

## Passwortschutz

Ohne gesetztes Passwort läuft der Server offen — im eigenen WLAN vertretbar,
sonst nicht. Mit Passwort:

```bash
ESSENS_PASSWORT="euer-familienpasswort" npm start
```

Jedes Gerät meldet sich einmal an (Einstellungen → Geräte-Abgleich) und bleibt
danach angemeldet. Falsche Passwörter werden nach acht Fehlversuchen für zehn
Minuten gesperrt, und der Vergleich läuft in gleichbleibender Zeit, damit sich
das Passwort nicht Zeichen für Zeichen erraten lässt.

## Daten

Alles liegt in `server/daten/stand.json`. Diese Datei ist die gemeinsame
Wahrheit der Familie — sie ist von Git ausgeschlossen und lässt sich einfach
kopieren, um sie zu sichern.

## Später: KI-Funktionen

Wenn Claude Rezepte vorschlagen soll, kommt der Anthropic-API-Schlüssel genau
hierher — in diesen Server, als Umgebungsvariable `ANTHROPIC_API_KEY`, niemals
in die App im Browser. Das Frontend ruft dann `POST /api/ai` auf
(vorbereitet in `src/lib/ai.ts`).
