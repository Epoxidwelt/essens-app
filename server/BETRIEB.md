# Dauerbetrieb: App immer erreichbar, ohne laufende Kosten

Ziel: Die App läuft rund um die Uhr im Heimnetz — unabhängig davon, ob dein
Arbeitsrechner an ist. Jedes Familienmitglied greift vom Handy oder Tablet zu.

Es gibt dafür **keine monatlichen Kosten**: kein Konto, keine Miete, keine Cloud.
Nötig ist nur ein kleines Gerät bei euch zu Hause, das durchläuft.

## Was kostet das?

| Gerät | Anschaffung | Strom im Jahr (grob) |
| --- | --- | --- |
| Alter Laptop / PC, den ihr schon habt | 0 € | ~30–60 € |
| Raspberry Pi 4 oder 5 (neu, mit Netzteil und Karte) | ~60–90 € | ~5–10 € |
| Raspberry Pi Zero 2 W (reicht für diese App) | ~25–35 € | ~2–4 € |
| NAS, das ohnehin schon läuft (Synology, QNAP) | 0 € | 0 € (läuft eh) |

*Stromkosten geschätzt bei rund 0,35 €/kWh und Dauerbetrieb.*

**Die günstigste Variante ist immer das Gerät, das du schon hast.** Ein alter
Laptop im Regal kostet null Anschaffung — er verbraucht nur mehr Strom als ein
Raspberry Pi. Wenn nichts herumliegt, ist ein Raspberry Pi nach etwa zwei Jahren
günstiger als ein alter Laptop.

## Einrichtung in vier Schritten

Beispiel Raspberry Pi oder alter Laptop mit Linux (Debian, Ubuntu, Raspberry Pi OS):

**1. Node.js installieren**

```bash
sudo apt update && sudo apt install -y nodejs npm git
```

**2. Projekt auf das Gerät kopieren**

Per USB-Stick, per Netzwerkfreigabe oder — wenn das Projekt in Git liegt:

```bash
git clone <euer-repository> essens-app
```

**3. Einrichtungsskript starten**

```bash
cd essens-app
bash server/betrieb/einrichten.sh
```

Es baut die App, fragt nach einem Familienpasswort und legt den Dienst an. Am
Ende steht die Adresse im Terminal, zum Beispiel:

```
http://192.168.178.45:5190
```

**4. Feste Adresse im Router vergeben**

Wichtig, sonst ändert sich die Adresse irgendwann und die Lesezeichen auf den
Handys gehen ins Leere. In der Fritzbox: *Heimnetz → Netzwerk → Gerät bearbeiten
→ „Diesem Netzwerkgerät immer die gleiche IPv4-Adresse zuweisen"*. Andere Router
nennen das *DHCP-Reservierung* oder *statische Zuordnung*.

Danach die Adresse am Handy öffnen und über das Teilen-Menü zum Home-Bildschirm
hinzufügen. Fertig — die App startet ab jetzt wie eine normale App.

### Auf einem Mac, der ohnehin durchläuft

Statt des Skripts die Vorlage `server/betrieb/de.essensapp.server.plist`
verwenden (Anleitung steht in der Datei). Wichtig: Ruhezustand abschalten,
sonst ist die App zwischendurch nicht erreichbar.

### Auf einem NAS

Synology und QNAP können Node.js über das Paketzentrum installieren. Danach ist
das Vorgehen dasselbe wie oben; statt systemd trägt man den Startbefehl im
Aufgabenplaner als „beim Hochfahren" ein.

## Passwort: ja oder nein?

Im eigenen WLAN ist ein Passwort nicht zwingend. Ich würde trotzdem eines
setzen — es kostet nur eine einmalige Eingabe je Gerät und schützt davor, dass
Gäste im WLAN oder ein unsicheres Smart-Home-Gerät an eure Daten kommen.

Das Skript fragt danach. Nachträglich ändern:

```bash
sudo nano server/daten/umgebung      # ESSENS_PASSWORT=... anpassen
sudo systemctl restart essens-app
```

Nach einer Passwortänderung müssen sich alle Geräte einmal neu anmelden.

## Was ist mit unterwegs?

Ihr habt euch für „nur zu Hause" entschieden — das ist die einfachste und
sicherste Variante. Im Supermarkt funktioniert die App trotzdem: Sie läuft
offline mit dem zuletzt geladenen Stand weiter, ihr könnt Dinge abhaken, und
sobald ihr wieder im WLAN seid, wird alles automatisch abgeglichen.

Sollte das später doch nicht reichen, gibt es zwei Wege — beide ohne
monatliche Kosten:

- **Privates Netz (WireGuard oder Tailscale):** Die Handys verbinden sich von
  unterwegs ins Heimnetz, die App bleibt für das Internet unsichtbar. Sicherste
  Variante.
- **Eigene Adresse mit Verschlüsselung:** Domain plus `server/betrieb/Caddyfile`.
  Dann ist die App öffentlich erreichbar und das Passwort ist Pflicht.

## Sicherung

Alles liegt in einer Datei: `server/daten/stand.json`. Eine Sicherung ist eine
einfache Kopie. Automatisch jede Nacht um drei:

```bash
crontab -e
```

```
0 3 * * * cp ~/essens-app/server/daten/stand.json ~/sicherungen/stand-$(date +\%F).json
```

Zusätzlich kann jedes Gerät jederzeit selbst eine Sicherungsdatei speichern
(Einstellungen → Daten sichern).

## App aktualisieren

```bash
cd essens-app
git pull                 # oder neue Dateien kopieren
npm install
npm run build
sudo systemctl restart essens-app
```

Die Daten in `server/daten/` bleiben dabei unangetastet.

## Wenn etwas nicht läuft

```bash
systemctl status essens-app     # Läuft der Dienst?
journalctl -u essens-app -f     # Was sagt er?
sudo systemctl restart essens-app
```

Häufigste Ursache, wenn das Handy die App nicht findet: Das Handy hängt im
Gastnetz des Routers statt im normalen WLAN. Gastnetze schotten Geräte
voneinander ab.
