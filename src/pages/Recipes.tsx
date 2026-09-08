import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { filterRecipes, findeFilter, trefferProFilter } from '../lib/filters';
import { plural } from '../lib/text';
import { useApp } from '../store/AppContext';
import { RecipeCard } from '../components/RecipeCard';
import { RubrikKacheln } from '../components/RubrikKacheln';

export function Recipes() {
  const { state, recipes } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  // Unbekannte Rubriken aus der Adresszeile fallen weg – sonst stuende in der
  // URL ein Filter, den die Auswahlleiste nicht anzeigen kann (etwa aus einem
  // alten Lesezeichen).
  const [active, setActive] = useState<string[]>(() =>
    (params.get('filter')?.split(',') ?? []).filter((id) => findeFilter(id)),
  );
  // Wer schon gewaehlt hat, will die Rezepte sehen – nicht noch einmal die
  // Rubriken. Aufklappen geht jederzeit.
  const [rubrikenOffen, setRubrikenOffen] = useState(active.length === 0);

  const favoriteIds = useMemo(
    () => new Set(state.favorites.map((f) => f.recipeId)),
    [state.favorites],
  );

  const results = useMemo(
    () => filterRecipes(recipes, { query, activeFilters: active, favoriteIds }),
    [query, active, favoriteIds, recipes],
  );

  const treffer = useMemo(
    () => trefferProFilter(recipes, { query, activeFilters: active, favoriteIds }),
    [query, active, favoriteIds, recipes],
  );

  function setzeAuswahl(next: string[]) {
    setActive(next);
    const p = new URLSearchParams(params);
    if (next.length) p.set('filter', next.join(','));
    else p.delete('filter');
    setParams(p, { replace: true });
  }

  function toggleFilter(id: string) {
    setzeAuswahl(active.includes(id) ? active.filter((x) => x !== id) : [...active, id]);
  }

  return (
    <>
      <div className="page-header">
        <h1>Rezepte</h1>
        <span className="spacer" />
        <Link to="/rezept-hinzufuegen" className="icon-btn" aria-label="Rezept hinzufügen">
          +
        </Link>
      </div>

      <div className="page" style={{ paddingTop: 4 }}>
        <div className="search">
          <span aria-hidden>🔍</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              const p = new URLSearchParams(params);
              if (e.target.value) p.set('q', e.target.value);
              else p.delete('q');
              setParams(p, { replace: true });
            }}
            placeholder="Rezept oder Zutat suchen …"
            aria-label="Rezepte durchsuchen"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                const p = new URLSearchParams(params);
                p.delete('q');
                setParams(p, { replace: true });
              }}
              aria-label="Suche leeren"
              style={{ border: 0, background: 'none', color: 'var(--ink-faint)' }}
            >
              ✕
            </button>
          )}
        </div>

        <div className="auswahl-leiste">
          <span className="anzahl">{plural(results.length, 'Rezept', 'Rezepte')}</span>
          {active.map((id) => {
            const rubrik = findeFilter(id);
            if (!rubrik) return null;
            return (
              <button
                key={id}
                type="button"
                className="auswahl-chip"
                onClick={() => toggleFilter(id)}
                aria-label={`${rubrik.name} abwählen`}
              >
                {rubrik.emoji} {rubrik.name}
                <span className="x" aria-hidden>✕</span>
              </button>
            );
          })}
          <span className="spacer" />
          {active.length > 0 && (
            <button type="button" className="link" style={{ border: 0, background: 'none' }}
              onClick={() => setzeAuswahl([])}>
              alles zeigen
            </button>
          )}
          <button
            type="button"
            className="link"
            style={{ border: 0, background: 'none' }}
            onClick={() => setRubrikenOffen((o) => !o)}
            aria-expanded={rubrikenOffen}
          >
            {rubrikenOffen ? 'Rubriken ausblenden' : 'Rubriken wählen'}
          </button>
        </div>

        {rubrikenOffen && (
          <RubrikKacheln aktiv={active} treffer={treffer} onToggle={toggleFilter} />
        )}

        <div className="recipe-grid" style={{ marginTop: 18 }}>
          {results.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="empty-state">
            <div className="big" aria-hidden>🍳</div>
            <h2>Nichts gefunden</h2>
            <p>Nimm eine Rubrik weg oder such nach etwas anderem.</p>
            {active.length > 0 && (
              <button type="button" className="btn" style={{ marginTop: 12 }} onClick={() => setzeAuswahl([])}>
                Alle Rezepte zeigen
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
