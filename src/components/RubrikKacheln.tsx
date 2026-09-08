import { FILTERS, FILTER_GRUPPEN } from '../lib/filters';
import { plural } from '../lib/text';

/**
 * Rubriken als Kacheln.
 *
 * Bewusst gross und mit Trefferzahl: Man soll auf einen Blick sehen, was eine
 * Rubrik bringt, und sie im Vorbeigehen treffen koennen. Eine Kachel, die
 * zusammen mit der aktuellen Auswahl kein Rezept mehr uebrig laesst, wird
 * ausgegraut – so laeuft man nicht in eine leere Liste.
 */
export function RubrikKacheln({
  aktiv,
  treffer,
  onToggle,
}: {
  aktiv: string[];
  treffer: Record<string, number>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rubriken">
      {FILTER_GRUPPEN.map((gruppe) => {
        const rubriken = FILTERS.filter((x) => x.gruppe === gruppe.id);
        if (rubriken.length === 0) return null;
        return (
          <section key={gruppe.id} className="rubrik-gruppe">
            <h2 className="rubrik-titel">{gruppe.titel}</h2>
            <div className="rubrik-grid">
              {rubriken.map((rubrik) => {
                const an = aktiv.includes(rubrik.id);
                const anzahl = treffer[rubrik.id] ?? 0;
                const leer = anzahl === 0 && !an;
                return (
                  <button
                    key={rubrik.id}
                    type="button"
                    className="rubrik"
                    aria-pressed={an}
                    disabled={leer}
                    onClick={() => onToggle(rubrik.id)}
                  >
                    <span className="rubrik-emoji" aria-hidden>
                      {rubrik.emoji}
                    </span>
                    <span className="rubrik-name">{rubrik.name}</span>
                    <span className="rubrik-zahl">
                      {leer ? 'keine' : plural(anzahl, 'Rezept', 'Rezepte')}
                    </span>
                    {rubrik.hinweis && <span className="rubrik-hinweis">{rubrik.hinweis}</span>}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
