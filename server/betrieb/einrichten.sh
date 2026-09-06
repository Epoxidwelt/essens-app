#!/usr/bin/env bash
#
# Richtet die Essens App als Dauerdienst auf einem Linux-Rechner ein
# (Raspberry Pi, alter Laptop, NAS mit Debian/Ubuntu).
#
# Aufruf im Projektordner:
#   bash server/betrieb/einrichten.sh
#
# Das Skript baut die App, fragt nach einem Familienpasswort und sorgt dafür,
# dass der Server bei jedem Neustart automatisch mitstartet.

set -euo pipefail

PROJEKT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DIENST="essens-app"
UMGEBUNG="$PROJEKT/server/daten/umgebung"
PORT="${PORT:-5190}"

echo
echo "  Essens App – Einrichtung als Dauerdienst"
echo "  Projektordner: $PROJEKT"
echo

# ---------------------------------------------------------------- Prüfungen

if ! command -v node >/dev/null 2>&1; then
  echo "  ✗ Node.js fehlt."
  echo "    Auf Raspberry Pi / Debian / Ubuntu installieren mit:"
  echo "      sudo apt update && sudo apt install -y nodejs npm"
  echo "    Danach dieses Skript erneut starten."
  exit 1
fi

NODE_VERSION="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "  ✗ Node.js ist zu alt (Version $NODE_VERSION, gebraucht wird 20 oder neuer)."
  echo "    Neuere Version installieren, dann erneut starten."
  exit 1
fi
echo "  ✓ Node.js Version $NODE_VERSION"

if ! command -v systemctl >/dev/null 2>&1; then
  echo "  ✗ Dieses System benutzt kein systemd."
  echo "    Auf einem Mac stattdessen server/betrieb/de.essensapp.server.plist verwenden."
  exit 1
fi
echo "  ✓ systemd vorhanden"

# ------------------------------------------------------------------- Bauen

echo
echo "  Baue die App … (das dauert ein bis zwei Minuten)"
cd "$PROJEKT"
# Die Bau-Werkzeuge werden zum Bauen gebraucht, also die vollstaendige Installation.
npm install --no-audit --no-fund >/dev/null
npm run build >/dev/null
echo "  ✓ App gebaut"

# ---------------------------------------------------------------- Passwort

echo
echo "  Familienpasswort festlegen."
echo "  Jedes Gerät gibt es einmal ein und bleibt danach angemeldet."
echo "  (Leer lassen = kein Passwort. Nur sinnvoll, wenn ihr eurem WLAN voll vertraut.)"
printf "  Passwort: "
read -r -s PASSWORT
echo

mkdir -p "$PROJEKT/server/daten"
{
  echo "PORT=$PORT"
  echo "ESSENS_PASSWORT=$PASSWORT"
} > "$UMGEBUNG"
chmod 600 "$UMGEBUNG"
echo "  ✓ Einstellungen gespeichert (nur für dich lesbar)"

# ------------------------------------------------------------------ Dienst

BENUTZER="$(id -un)"
NODE_PFAD="$(command -v node)"

echo
echo "  Richte den Dienst ein (dafür wird das sudo-Passwort gebraucht) …"

sudo tee "/etc/systemd/system/$DIENST.service" >/dev/null <<EOF
[Unit]
Description=Essens App – Familien-Server
After=network.target

[Service]
Type=simple
User=$BENUTZER
WorkingDirectory=$PROJEKT
EnvironmentFile=$UMGEBUNG
ExecStart=$NODE_PFAD server/serve.mjs
Restart=always
RestartSec=5
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable "$DIENST" >/dev/null
sudo systemctl restart "$DIENST"

sleep 2

if ! systemctl is-active --quiet "$DIENST"; then
  echo "  ✗ Der Dienst läuft nicht. Fehlermeldung:"
  sudo journalctl -u "$DIENST" -n 20 --no-pager
  exit 1
fi

# ------------------------------------------------------------------ Fertig

ADRESSE="$(hostname -I 2>/dev/null | awk '{print $1}')"
NAME="$(hostname)"

echo "  ✓ Dienst läuft und startet ab jetzt automatisch mit"
echo
echo "  Die App erreicht ihr im WLAN unter:"
echo "      http://$ADRESSE:$PORT"
if command -v avahi-daemon >/dev/null 2>&1; then
  echo "      http://$NAME.local:$PORT   (bleibt gleich, auch wenn sich die Adresse ändert)"
fi
echo
echo "  Am Handy öffnen und über das Teilen-Menü zum Home-Bildschirm hinzufügen."
echo
echo "  Nützliche Befehle:"
echo "      systemctl status $DIENST      – läuft er?"
echo "      journalctl -u $DIENST -f      – Protokoll mitlesen"
echo "      sudo systemctl restart $DIENST – neu starten"
echo
