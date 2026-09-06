import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Ingredient, RecipeCategory, RecipeIngredient } from '../types';
import { erkenneRezept } from '../lib/textExtraction';
import { strukturiereRezeptText } from '../lib/recipeTextStructure';
import { parseZutatenText } from '../lib/ingredientParsing';
import { holeVideoInfo, istYoutubeLink, type YoutubeVideoInfo } from '../lib/youtube';
import { importiereRezeptVonLink } from '../lib/syncClient';
import { useApp } from '../store/AppContext';
import { useToast } from '../components/Toast';

type Schritt = 'start' | 'liest' | 'youtube' | 'formular';

const TONES = ['green', 'tomato', 'sun', 'berry', 'cream', 'herb'] as const;

/** Wählt zufällig eine Platzhalterfarbe, solange kein Foto vorhanden ist. */
function zufaelligerTon() {
  return TONES[Math.floor(Math.random() * TONES.length)];
}

export function AddRecipe() {
  const navigate = useNavigate();
  const { addCustomRecipe } = useApp();
  const { showToast, toast } = useToast();
  const dateiInput = useRef<HTMLInputElement>(null);

  const [schritt, setSchritt] = useState<Schritt>('start');
  const [fortschrittText, setFortschrittText] = useState('');
  const [fortschrittAnteil, setFortschrittAnteil] = useState(0);
  const [fehler, setFehler] = useState<string | null>(null);
  const [hinweisUngenau, setHinweisUngenau] = useState(false);

  // Formularfelder
  const [bild, setBild] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [portionen, setPortionen] = useState(4);
  const [minuten, setMinuten] = useState(30);
  const [zutatenText, setZutatenText] = useState('');
  const [zubereitungText, setZubereitungText] = useState('');
  const [ohneZucker, setOhneZucker] = useState(true);
  const [kinderfreundlich, setKinderfreundlich] = useState(true);
  const [onePot, setOnePot] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

  // YouTube-Zwischenschritt
  const [ytEingabe, setYtEingabe] = useState('');
  const [ytLaedt, setYtLaedt] = useState(false);
  const [ytInfo, setYtInfo] = useState<YoutubeVideoInfo | null>(null);
  const [ytFehler, setYtFehler] = useState<string | null>(null);
  const [ytBeschreibung, setYtBeschreibung] = useState('');

  function formularVorbefuellen(erkannterText: string) {
    const struktur = strukturiereRezeptText(erkannterText);
    setName(struktur.titel || 'Neues Rezept');
    setZutatenText(struktur.zutatenText);
    setZubereitungText(struktur.zubereitungText);
    // Kaum Text erkannt? Dann lieber früh sagen, dass Nachbessern nötig ist,
    // statt ein leeres Formular unkommentiert dazustehen zu lassen.
    setHinweisUngenau(erkannterText.trim().length < 20);
  }

  async function dateiVerarbeiten(datei: File) {
    setFehler(null);
    setSchritt('liest');
    setFortschrittAnteil(0);
    setFortschrittText('Wird geöffnet …');
    try {
      const ergebnis = await erkenneRezept(datei, (anteil, text) => {
        setFortschrittAnteil(anteil);
        setFortschrittText(text);
      });
      setBild(ergebnis.vorschaubild);
      setVideoUrl(undefined);
      formularVorbefuellen(ergebnis.text);
      setSchritt('formular');
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Das hat leider nicht funktioniert.');
      setSchritt('start');
    }
  }

  function vonHandStarten() {
    setBild(undefined);
    setVideoUrl(undefined);
    setName('');
    setBeschreibung('');
    setZutatenText('');
    setZubereitungText('');
    setHinweisUngenau(false);
    setFehler(null);
    setSchritt('formular');
  }

  function youtubeStarten() {
    setYtEingabe('');
    setYtInfo(null);
    setYtFehler(null);
    setYtBeschreibung('');
    setFehler(null);
    setSchritt('youtube');
  }

  /**
   * Übernimmt einen Link. Erster Versuch: der Familien-Server liest die Seite
   * selbst (funktioniert bei YouTube und den meisten Rezept-Webseiten, oft
   * sogar mit exakten Zutaten statt nur grobem Text). Ist kein Server
   * erreichbar, bleibt bei YouTube wenigstens Titel/Vorschaubild automatisch
   * verfügbar (ohne Server erreichbare, öffentliche Schnittstelle); bei
   * anderen Seiten bleibt dann nur die Handeingabe.
   */
  async function linkUebernehmen() {
    const eingabe = ytEingabe.trim();
    if (!eingabe) return;
    setYtLaedt(true);
    setYtFehler(null);
    setYtInfo(null);

    const serverErgebnis = await importiereRezeptVonLink(eingabe);

    if (serverErgebnis.art === 'ok') {
      const vorschlag = serverErgebnis.wert;
      const bildAusServer = vorschlag.bild;

      if (vorschlag.art === 'strukturiert') {
        // Bestmöglicher Fall: die Seite liefert exakte Zutaten/Schritte –
        // direkt ins Formular, kein Abtippen oder Einfügen nötig.
        setYtLaedt(false);
        setName(vorschlag.titel || 'Neues Rezept');
        setBeschreibung(vorschlag.beschreibung);
        setZutatenText(vorschlag.zutatenZeilen.join('\n'));
        setZubereitungText(vorschlag.zubereitungsSchritte.join('\n'));
        if (vorschlag.portionen) setPortionen(vorschlag.portionen);
        if (vorschlag.minuten) setMinuten(vorschlag.minuten);
        setBild(bildAusServer);
        setVideoUrl(eingabe);
        setHinweisUngenau(false);
        setSchritt('formular');
        return;
      }

      // Kein strukturiertes Rezept gefunden, aber die Seite selbst wurde
      // gelesen – meist reicht der gefundene Text trotzdem zum Zerlegen.
      if (vorschlag.rohtext.trim().length >= 20) {
        setYtLaedt(false);
        formularVorbefuellen(vorschlag.rohtext);
        if (vorschlag.titel) setName(vorschlag.titel);
        setBild(bildAusServer);
        setVideoUrl(eingabe);
        setSchritt('formular');
        return;
      }

      // Seite erreicht, aber nichts Brauchbares gefunden – Vorschau zeigen
      // und von Hand weitermachen lassen.
      setYtLaedt(false);
      setYtInfo({
        videoId: '',
        titel: vorschlag.titel ?? '',
        kanal: '',
        vorschaubild: bildAusServer ?? '',
        videoUrl: eingabe,
      });
      return;
    }

    if (serverErgebnis.art === 'abgelehnt') {
      setYtLaedt(false);
      setYtFehler(serverErgebnis.meldung);
      return;
    }

    if (serverErgebnis.art === 'anmeldung') {
      setYtLaedt(false);
      setYtFehler('Der Familien-Server verlangt eine Anmeldung. Bitte zuerst in den Einstellungen anmelden.');
      return;
    }

    // Kein Server erreichbar: bei YouTube wenigstens Titel/Vorschaubild holen
    // (funktioniert ohne Server, siehe src/lib/youtube.ts).
    if (istYoutubeLink(eingabe)) {
      const info = await holeVideoInfo(eingabe);
      setYtLaedt(false);
      if (info) {
        setYtInfo(info);
        return;
      }
    } else {
      setYtLaedt(false);
    }
    setYtFehler(
      istYoutubeLink(eingabe)
        ? 'Video nicht gefunden. Bitte den Link prüfen – trotzdem lässt sich unten von Hand weitermachen.'
        : 'Kein Familien-Server erreichbar – für Rezept-Webseiten (außer YouTube) wird er zum automatischen Lesen gebraucht. Bitte von Hand weitermachen.',
    );
  }

  /** Übernimmt Titel/Vorschaubild (z. B. per oEmbed) und die eingefügte Beschreibung ins Formular. */
  function vorschauUebernehmen() {
    setBild(ytInfo?.vorschaubild || undefined);
    setVideoUrl(ytInfo?.videoUrl);
    if (ytBeschreibung.trim()) {
      formularVorbefuellen(ytBeschreibung);
      if (ytInfo?.titel) setName(ytInfo.titel);
    } else {
      setName(ytInfo?.titel ?? '');
      setBeschreibung('');
      setZutatenText('');
      setZubereitungText('');
      setHinweisUngenau(true);
    }
    setSchritt('formular');
  }

  function speichern() {
    if (!name.trim()) {
      setFehler('Bitte einen Namen für das Rezept eingeben.');
      return;
    }

    const geparsteZutaten = parseZutatenText(zutatenText);
    const ingredients: RecipeIngredient[] = geparsteZutaten.map((z) => z.recipeIngredient);
    const neueZutaten: Ingredient[] = geparsteZutaten.filter((z) => z.neu).map((z) => z.ingredient);

    const steps = zubereitungText
      .split('\n')
      .map((zeile) => zeile.trim().replace(/^\d+[.)]\s*/, '').replace(/^[-•*]\s*/, ''))
      .filter((zeile) => zeile.length > 0);

    const categories: RecipeCategory[] = [];
    if (onePot) categories.push('one-pot');
    if (kinderfreundlich) categories.push('kinderliebling');
    if (minuten <= 20) categories.push('unter-20');
    else if (minuten <= 30) categories.push('unter-30');

    const rezept = addCustomRecipe(
      {
        name: name.trim(),
        description: beschreibung.trim(),
        ...(bild ? { image: bild } : {}),
        ...(videoUrl ? { videoUrl } : {}),
        placeholder: {
          emoji: videoUrl ? (istYoutubeLink(videoUrl) ? '📺' : '🔗') : '📷',
          tone: zufaelligerTon(),
        },
        baseServings: portionen,
        timeMinutes: minuten,
        difficulty: 'einfach',
        ingredients,
        steps: steps.length > 0 ? steps : ['Zubereitung noch ergänzen.'],
        nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
        categories,
        noAddedSugar: ohneZucker,
        kidFriendly: kinderfreundlich,
        onePot,
      },
      neueZutaten,
    );

    showToast('✅ Rezept gespeichert');
    navigate(`/rezept/${rezept.id}`);
  }

  return (
    <>
      <div className="page-header">
        <button type="button" className="icon-btn" onClick={() => navigate(-1)} aria-label="Zurück">
          ←
        </button>
        <h1>Rezept hinzufügen</h1>
      </div>

      <div className="page" style={{ paddingTop: 4 }}>
        {schritt === 'start' && (
          <div className="stack">
            <div className="card" style={{ textAlign: 'center', padding: 28 }}>
              <div style={{ fontSize: 46 }} aria-hidden>
                📷
              </div>
              <h2 style={{ marginTop: 10 }}>Foto oder PDF hochladen</h2>
              <p className="hint" style={{ marginTop: 8 }}>
                Ein Rezept aus einem Kochbuch, einer Zeitschrift oder als PDF fotografieren
                oder auswählen – die App liest Zutaten und Zubereitung automatisch heraus.
                Alles passiert auf diesem Gerät, nichts wird hochgeladen.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-block"
                style={{ marginTop: 18 }}
                onClick={() => dateiInput.current?.click()}
              >
                Foto oder PDF auswählen
              </button>
              <input
                ref={dateiInput}
                type="file"
                accept="image/*,application/pdf"
                hidden
                onChange={(e) => {
                  const datei = e.target.files?.[0];
                  if (datei) void dateiVerarbeiten(datei);
                  e.target.value = '';
                }}
              />
            </div>

            {fehler && (
              <div className="card" style={{ borderColor: 'var(--accent)' }}>
                <p style={{ color: 'var(--accent)', fontSize: 14 }}>{fehler}</p>
              </div>
            )}

            <button type="button" className="btn btn-ghost btn-block" onClick={youtubeStarten}>
              🔗 Rezept-Link einfügen (YouTube oder Webseite)
            </button>
            <button type="button" className="btn btn-ghost btn-block" onClick={vonHandStarten}>
              ✏️ Stattdessen von Hand eingeben
            </button>
          </div>
        )}

        {schritt === 'youtube' && (
          <div className="stack">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => setSchritt('start')}
            >
              ← Zurück
            </button>

            <div className="card">
              <h3>Rezept-Link</h3>
              <p className="hint" style={{ marginTop: 4 }}>
                YouTube-Video oder Rezept-Webseite (z. B. Chefkoch, Foodblog). Läuft der
                Familien-Server, werden Zutaten und Zubereitung meist automatisch erkannt.
              </p>
              <div className="row" style={{ marginTop: 10, gap: 8 }}>
                <input
                  className="search"
                  style={{ flex: 1 }}
                  value={ytEingabe}
                  onChange={(e) => setYtEingabe(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void linkUebernehmen()}
                  placeholder="https://…"
                  inputMode="url"
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!ytEingabe.trim() || ytLaedt}
                  onClick={() => void linkUebernehmen()}
                >
                  {ytLaedt ? '…' : 'Übernehmen'}
                </button>
              </div>
              {ytLaedt && <p className="hint" style={{ marginTop: 8 }}>Das kann einige Sekunden dauern …</p>}
              {ytFehler && (
                <p style={{ marginTop: 10, color: 'var(--accent)', fontSize: 14 }}>{ytFehler}</p>
              )}
            </div>

            {ytInfo && (
              <div className="card row" style={{ gap: 12 }}>
                {ytInfo.vorschaubild && (
                  <img
                    src={ytInfo.vorschaubild}
                    alt=""
                    style={{ width: 96, height: 54, objectFit: 'cover', borderRadius: 10, flex: '0 0 auto' }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 650 }}>{ytInfo.titel || 'Ohne Titel gefunden'}</div>
                  {ytInfo.kanal && <div className="hint">{ytInfo.kanal}</div>}
                </div>
              </div>
            )}

            {(ytInfo || ytFehler) && (
              <div className="card">
                <h3>Beschreibung einfügen</h3>
                <p className="hint" style={{ marginTop: 4 }}>
                  Bei YouTube: unter dem Video auf „Mehr“ tippen und den Text (meist mit
                  Zutaten und Zubereitung) kopieren. Bei einer Webseite: den Rezepttext
                  markieren und kopieren. Dann hier einfügen.
                </p>
                <textarea
                  className="textarea"
                  style={{ marginTop: 10, minHeight: 160, fontFamily: 'inherit' }}
                  value={ytBeschreibung}
                  onChange={(e) => setYtBeschreibung(e.target.value)}
                  placeholder={'Zutaten\n500 g Kartoffeln\n…\n\nZubereitung\n1. …'}
                />
              </div>
            )}

            {(ytInfo || ytFehler) && (
              <button type="button" className="btn btn-primary btn-block" onClick={vorschauUebernehmen}>
                Weiter
              </button>
            )}
          </div>
        )}

        {schritt === 'liest' && (
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 40 }} aria-hidden>
              🔎
            </div>
            <h2 style={{ marginTop: 12 }}>{fortschrittText || 'Text wird erkannt …'}</h2>
            <div
              style={{
                marginTop: 16,
                height: 8,
                borderRadius: 999,
                background: 'var(--surface-soft)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.round(fortschrittAnteil * 100)}%`,
                  background: 'var(--brand)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
            <p className="hint" style={{ marginTop: 14 }}>
              Das kann bei größeren Fotos oder mehrseitigen PDFs eine Weile dauern.
            </p>
          </div>
        )}

        {schritt === 'formular' && (
          <div className="stack">
            {hinweisUngenau && (
              <div className="card" style={{ background: 'var(--accent-soft)', borderColor: 'transparent' }}>
                <p style={{ fontSize: 14 }}>
                  Es wurde kaum Text erkannt. Bitte Name, Zutaten und Zubereitung unten von
                  Hand ergänzen.
                </p>
              </div>
            )}

            {bild && (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={bild} alt="" style={{ width: '100%', display: 'block' }} />
              </div>
            )}

            <div className="card">
              <h3>Name</h3>
              <input
                className="search"
                style={{ marginTop: 8, width: '100%' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z. B. Omas Kartoffelsuppe"
              />

              <h3 style={{ marginTop: 16 }}>Kurzbeschreibung (optional)</h3>
              <textarea
                className="textarea"
                style={{ marginTop: 8, minHeight: 60 }}
                value={beschreibung}
                onChange={(e) => setBeschreibung(e.target.value)}
                placeholder="Ein Satz, der Lust aufs Kochen macht."
              />
            </div>

            <div className="card">
              <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <h3>Portionen</h3>
                  <div className="stepper" style={{ marginTop: 8 }}>
                    <button type="button" onClick={() => setPortionen((p) => Math.max(1, p - 1))} aria-label="Weniger">
                      −
                    </button>
                    <span className="count">{portionen}</span>
                    <button type="button" onClick={() => setPortionen((p) => Math.min(12, p + 1))} aria-label="Mehr">
                      +
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <h3>Zeit (Minuten)</h3>
                  <input
                    className="search"
                    style={{ marginTop: 8, width: '100%' }}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={minuten}
                    onChange={(e) => setMinuten(Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Zutaten</h3>
              <p className="hint" style={{ marginTop: 4 }}>
                Eine Zutat pro Zeile, z. B. „500 g Kartoffeln" oder „2 Zwiebeln, gewürfelt".
              </p>
              <textarea
                className="textarea"
                style={{ marginTop: 10, minHeight: 160, fontFamily: 'inherit' }}
                value={zutatenText}
                onChange={(e) => setZutatenText(e.target.value)}
                placeholder={'500 g Kartoffeln\n2 Zwiebeln\n1 TL Salz'}
              />
            </div>

            <div className="card">
              <h3>Zubereitung</h3>
              <p className="hint" style={{ marginTop: 4 }}>Ein Schritt pro Zeile.</p>
              <textarea
                className="textarea"
                style={{ marginTop: 10, minHeight: 160, fontFamily: 'inherit' }}
                value={zubereitungText}
                onChange={(e) => setZubereitungText(e.target.value)}
                placeholder={'Kartoffeln schälen und würfeln.\nMit Wasser bedeckt weich kochen.'}
              />
            </div>

            <div className="card">
              <h3>Kennzeichnung</h3>
              <div className="stack" style={{ marginTop: 10, gap: 10 }}>
                <label className="row" style={{ gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={ohneZucker} onChange={(e) => setOhneZucker(e.target.checked)} />
                  <span>✓ Ohne zugesetzten Zucker</span>
                </label>
                <label className="row" style={{ gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={kinderfreundlich}
                    onChange={(e) => setKinderfreundlich(e.target.checked)}
                  />
                  <span>👨‍👩‍👧‍👦 Kinderfreundlich</span>
                </label>
                <label className="row" style={{ gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={onePot} onChange={(e) => setOnePot(e.target.checked)} />
                  <span>🥘 One Pot</span>
                </label>
              </div>
              <p className="hint" style={{ marginTop: 10 }}>
                Nährwerte sind bei eigenen Rezepten nicht bekannt und werden in der App als
                „unbekannt" angezeigt.
              </p>
            </div>

            {fehler && <p style={{ color: 'var(--accent)', fontSize: 14 }}>{fehler}</p>}

            <button type="button" className="btn btn-primary btn-block" onClick={speichern}>
              Rezept speichern
            </button>
            <button type="button" className="btn btn-ghost btn-block" onClick={() => setSchritt('start')}>
              Abbrechen
            </button>
          </div>
        )}
      </div>

      {toast}
    </>
  );
}
