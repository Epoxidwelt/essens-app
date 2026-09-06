# Die App online erreichbar machen

Ziel: Die App von überall öffnen — im Supermarkt, bei der Arbeit, unterwegs.

Vorher unbedingt lesen: **Sobald der Server aus dem Internet erreichbar ist,
sind drei Dinge Pflicht.**

1. **Passwort setzen** (`ESSENS_PASSWORT`) — sonst kann jeder eure Daten lesen.
2. **HTTPS** — ohne Verschlüsselung geht das Passwort im Klartext durchs Netz.
3. **Automatische Updates** auf dem Server, damit bekannte Lücken geschlossen werden.

Der Server bringt dafür schon mit: Passwortschutz mit Sperre nach acht
Fehlversuchen, Anmeldungen laufen nach 180 Tagen ab, alle Geräte lassen sich auf
einen Schlag abmelden, Schutzköpfe gegen Einbettung in fremde Seiten. Geprüft
durch `npm run test:server` (22 Prüfungen).

## Das Problem mit dem MacBook

Ein Laptop ist als Dauerserver schlecht geeignet:

- Zuklappen beendet den Betrieb (Ruhezustand)
- Er wandert mit aus dem Haus — dann ist die App weg
- Er müsste dauerhaft am Strom hängen

Das MacBook ist ideal zum **Entwickeln** und funktioniert gut für den Betrieb
**im Heimnetz**. Für „von überall jederzeit erreichbar" ist es die schwächste
Grundlage. Deshalb im Folgenden drei Wege, vom robustesten zum billigsten.

---

## Weg 1: Kleiner Mietserver (empfohlen)

Ein kleiner vServer läuft rund um die Uhr, unabhängig von euren Geräten.

**Kosten:** etwa 3–5 € im Monat (z. B. netcup, Hetzner) plus ~10 €/Jahr Domain.

**Einrichtung:**

```bash
# auf dem Server
sudo apt update && sudo apt install -y nodejs npm git caddy
git clone <euer-repository> essens-app
cd essens-app
bash server/betrieb/einrichten.sh          # baut, fragt Passwort, richtet Dienst ein

# Verschlüsselung: Domain in die Vorlage eintragen
sudo cp server/betrieb/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile             # essen.eure-domain.de eintragen
sudo systemctl reload caddy
```

Danach ist die App unter `https://essen.eure-domain.de` erreichbar. Caddy holt
das Zertifikat automatisch und erneuert es von allein.

**Firewall:** Nur 80 und 443 offen lassen, Port 5190 zu:

```bash
sudo ufw allow 80,443/tcp && sudo ufw enable
```

**Vorteile:** immer erreichbar, unabhängig von zu Hause, richtige Webadresse.
**Nachteil:** kleine monatliche Kosten, ein Server will gepflegt werden.

---

## Weg 2: MacBook zu Hause + Tunnel (0 € im Monat)

Ein Tunnel verbindet euren Rechner nach außen, ohne dass ihr im Router Ports
öffnen müsst — funktioniert auch bei Anschlüssen ohne eigene IPv4-Adresse
(DS-Lite, verbreitet bei Kabelanschlüssen).

Mit **Cloudflare Tunnel** (kostenlos, Domain nötig, ~10 €/Jahr):

```bash
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create essens-app
cloudflared tunnel route dns essens-app essen.eure-domain.de
cloudflared tunnel run --url http://localhost:5190 essens-app
```

HTTPS bringt Cloudflare mit. Zusätzlich muss das MacBook laufen:

```bash
cp server/betrieb/de.essensapp.server.plist ~/Library/LaunchAgents/
launchctl load -w ~/Library/LaunchAgents/de.essensapp.server.plist
```

Und der Ruhezustand muss aus (Systemeinstellungen → Batterie → „Automatischen
Ruhezustand deaktivieren, wenn das Display ausgeschaltet ist"), am besten am
Netzteil und mit angeschlossenem Bildschirm oder geöffnetem Deckel.

**Vorteile:** keine monatlichen Kosten, Daten bleiben auf eurem Rechner.
**Nachteile:** App ist weg, sobald das MacBook aus ist oder das Haus verlässt.
Cloudflare sieht den Datenverkehr (die Verschlüsselung endet dort).

---

## Weg 3: Nur für euch, ohne öffentliche Adresse

**Tailscale** (kostenlos für privat) verbindet eure Handys mit dem MacBook, als
wären sie im selben WLAN. Die App steht dabei **nicht** im Internet — niemand
kann sie finden oder angreifen.

```bash
brew install --cask tailscale       # auf dem MacBook
# Tailscale-App auf jedem Handy installieren, gleiches Konto
```

Danach erreicht ihr die App unterwegs unter der Tailscale-Adresse des MacBooks,
z. B. `http://macbook-von-gerald:5190`.

**Vorteile:** sicherste Variante, kostenlos, keine Domain nötig.
**Nachteile:** auf jedem Gerät muss die Tailscale-App laufen; keine normale
Webadresse; MacBook muss trotzdem an sein.

---

## Vergleich

| | Weg 1: Mietserver | Weg 2: Tunnel | Weg 3: Tailscale |
| --- | --- | --- | --- |
| Kosten im Monat | 3–5 € | 0 € | 0 € |
| Einmalig | Domain ~10 €/Jahr | Domain ~10 €/Jahr | – |
| Immer erreichbar | ✅ | nur wenn MacBook läuft | nur wenn MacBook läuft |
| Normale Webadresse | ✅ | ✅ | ❌ |
| Fremder Anbieter sieht Daten | nein | ja (Cloudflare) | nein |
| Aufwand je Handy | keiner | keiner | App einrichten |

## Was in jedem Fall gilt

- **Sicherung:** `server/daten/stand.json` regelmäßig kopieren (siehe [BETRIEB.md](BETRIEB.md)).
- **Passwort:** lang und einmalig. Bei Verlust eines Handys alle Geräte abmelden
  (Einstellungen → Geräte-Abgleich → abmelden, oder am Server
  `curl -X DELETE -H "Authorization: Bearer <marke>" https://…/api/sitzungen`).
- **Updates:** `sudo apt update && sudo apt upgrade` regelmäßig, bei Weg 1 am
  besten automatisch (`unattended-upgrades`).
