import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RECIPES } from '../data/recipes';
import { backupFileName, createBackup, describeState, parseBackup } from '../lib/backup';
import { plural } from '../lib/text';
import { useApp } from '../store/AppContext';
import { useToast } from '../components/Toast';

export function Settings() {
  const { state, sync, setHousehold, importState, resetAll, anmeldenAmServer, abmeldenVomServer } =
    useApp();
  const { showToast, toast } = useToast();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [passwort, setPasswort] = useState('');
  const [anmeldeFehler, setAnmeldeFehler] = useState<string | null>(null);
  const [meldetAn, setMeldetAn] = useState(false);

  const { adults, kids } = state.user.household;

  function handleExport() {
    const blob = new Blob([JSON.stringify(createBackup(state), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = backupFileName();
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('💾 Sicherung gespeichert');
  }

  async function handleImportFile(file: File) {
    setError(null);
    try {
      const next = parseBackup(await file.text());
      importState(next);
      showToast('✅ Sicherung eingespielt');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Die Datei konnte nicht gelesen werden.');
    }
  }

  return (
    <>
      <div className="page-header">
        <button type="button" className="icon-btn" onClick={() => navigate(-1)} aria-label="Zurück">
          ←
        </button>
        <h1>Einstellungen</h1>
      </div>

      <div className="page stack" style={{ paddingTop: 4 }}>
        <div className="card">
          <h2>👨‍👩‍👧‍👦 Eure Familie</h2>
          <p className="hint" style={{ marginTop: 6 }}>
            Bestimmt, für wie viele Portionen Rezepte standardmäßig gerechnet werden.
          </p>

          <div className="servings" style={{ marginTop: 14 }}>
            <span className="label">Erwachsene</span>
            <div className="stepper">
              <button type="button" onClick={() => setHousehold(Math.max(1, adults - 1), kids)} aria-label="Weniger Erwachsene">
                −
              </button>
              <span className="count">{adults}</span>
              <button type="button" onClick={() => setHousehold(Math.min(10, adults + 1), kids)} aria-label="Mehr Erwachsene">
                +
              </button>
            </div>
          </div>

          <div className="servings">
            <span className="label">Kinder</span>
            <div className="stepper">
              <button type="button" onClick={() => setHousehold(adults, Math.max(0, kids - 1))} aria-label="Weniger Kinder">
                −
              </button>
              <span className="count">{kids}</span>
              <button type="button" onClick={() => setHousehold(adults, Math.min(10, kids + 1))} aria-label="Mehr Kinder">
                +
              </button>
            </div>
          </div>

          <p className="hint">
            Rezepte öffnen sich mit {plural(state.user.defaultServings, 'Portion', 'Portionen')}.
          </p>
        </div>

        <div className="card">
          <h2>🔄 Geräte-Abgleich</h2>
          {sync.state === 'anmeldung' ? (
            <>
              <p className="hint" style={{ marginTop: 6 }}>
                Der Familien-Server verlangt ein Passwort. Einmal eingeben – dieses
                Gerät bleibt danach angemeldet.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setMeldetAn(true);
                  setAnmeldeFehler(null);
                  const ergebnis = await anmeldenAmServer(passwort);
                  setMeldetAn(false);
                  if (ergebnis.ok) {
                    setPasswort('');
                    showToast('✅ Gerät angemeldet');
                  } else {
                    setAnmeldeFehler(ergebnis.fehler);
                  }
                }}
              >
                <div className="search" style={{ marginTop: 12 }}>
                  <span aria-hidden>🔒</span>
                  <input
                    type="password"
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    placeholder="Familienpasswort"
                    aria-label="Familienpasswort"
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  style={{ marginTop: 12 }}
                  disabled={!passwort || meldetAn}
                >
                  {meldetAn ? 'Melde an …' : 'Anmelden'}
                </button>
              </form>
              {anmeldeFehler && (
                <p style={{ marginTop: 10, color: 'var(--accent)', fontSize: 14 }}>{anmeldeFehler}</p>
              )}
            </>
          ) : sync.state === 'aus' ? (
            <>
              <p className="hint" style={{ marginTop: 6 }}>
                Zurzeit kein Familien-Server erreichbar. Die App speichert nur auf
                diesem Gerät.
              </p>
              <p className="hint" style={{ marginTop: 8 }}>
                Der Server läuft bei euch zu Hause: im Projektordner
                <code> npm start </code> ausführen und die App über die angezeigte
                WLAN-Adresse öffnen. Dann teilen sich alle Geräte dieselbe
                Einkaufsliste — ohne Konto und ohne fremde Anbieter.
              </p>
            </>
          ) : (
            <>
              <p style={{ marginTop: 6, fontSize: 14 }}>
                <span className="tag tag-green">
                  {sync.state === 'abgleich' ? '⏳ Gleicht ab …' : '✓ Verbunden'}
                </span>
              </p>
              <p className="hint" style={{ marginTop: 8 }}>
                Favoriten, Einkaufsliste und Wochenplan sind auf allen Geräten gleich.
                {sync.lastSyncAt &&
                  ` Zuletzt abgeglichen um ${new Date(sync.lastSyncAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr.`}
              </p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => {
                  abmeldenVomServer();
                  showToast('Gerät abgemeldet');
                }}
              >
                Dieses Gerät abmelden
              </button>
            </>
          )}
        </div>

        <div className="card">
          <h2>💾 Daten sichern</h2>
          <p className="hint" style={{ marginTop: 6 }}>
            Favoriten, Bewertungen, Einkaufsliste und Wochenplan liegen zurzeit nur auf
            diesem Gerät. Speichere ab und zu eine Sicherung – so gehen sie beim
            Gerätewechsel nicht verloren.
          </p>
          <p style={{ marginTop: 10, fontSize: 14 }}>{describeState(state)}</p>

          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button type="button" className="btn btn-primary" onClick={handleExport}>
              Sicherung speichern
            </button>
            <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
              Sicherung einspielen
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportFile(file);
              e.target.value = '';
            }}
          />
          {error && (
            <p style={{ marginTop: 10, color: 'var(--accent)', fontSize: 14 }}>{error}</p>
          )}
          <p className="hint" style={{ marginTop: 10 }}>
            Beim Einspielen wird der aktuelle Stand ersetzt.
          </p>
        </div>

        <div className="card">
          <h2>📱 App aufs Handy</h2>
          <p className="hint" style={{ marginTop: 6 }}>
            <strong>iPhone:</strong> in Safari öffnen → Teilen-Symbol → „Zum Home-Bildschirm“.
            <br />
            <strong>Android:</strong> in Chrome öffnen → Menü → „App installieren“.
          </p>
          <p className="hint" style={{ marginTop: 8 }}>
            Danach startet die App wie eine normale App und funktioniert auch ohne Empfang.
          </p>
        </div>

        <div className="card">
          <h2>Über die App</h2>
          <p className="hint" style={{ marginTop: 6 }}>
            {plural(RECIPES.length, 'Rezept', 'Rezepte')} ohne zugesetzten Zucker und ohne
            Fisch · davon {RECIPES.filter((r) => r.onePot).length} One-Pot-Gerichte
          </p>

          {confirmReset ? (
            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 14 }}>
                Wirklich alle Favoriten, Bewertungen, die Einkaufsliste und den Wochenplan löschen?
              </p>
              <div className="row" style={{ marginTop: 10, gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={() => {
                    resetAll();
                    setConfirmReset(false);
                    showToast('Alle Daten gelöscht');
                  }}
                >
                  Ja, alles löschen
                </button>
                <button type="button" className="btn" onClick={() => setConfirmReset(false)}>
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 14 }}
              onClick={() => setConfirmReset(true)}
            >
              Alle Daten löschen
            </button>
          )}
        </div>
      </div>

      {toast}
    </>
  );
}
