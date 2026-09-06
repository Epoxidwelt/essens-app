import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RECIPES } from '../data/recipes';
import { FILTERS, filterRecipes } from '../lib/filters';
import { useApp } from '../store/AppContext';
import { RecipeCard } from '../components/RecipeCard';

export function Recipes() {
  const { state } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [active, setActive] = useState<string[]>(
    params.get('filter') ? params.get('filter')!.split(',') : [],
  );

  const favoriteIds = useMemo(
    () => new Set(state.favorites.map((f) => f.recipeId)),
    [state.favorites],
  );

  const results = useMemo(
    () => filterRecipes(RECIPES, { query, activeFilters: active, favoriteIds }),
    [query, active, favoriteIds],
  );

  function toggleFilter(id: string) {
    const next = active.includes(id) ? active.filter((f) => f !== id) : [...active, id];
    setActive(next);
    const p = new URLSearchParams(params);
    if (next.length) p.set('filter', next.join(','));
    else p.delete('filter');
    setParams(p, { replace: true });
  }

  return (
    <>
      <div className="page-header">
        <h1>Rezepte</h1>
        <span className="spacer" />
        <span className="sub">{results.length} von {RECIPES.length}</span>
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
        </div>

        <div className="chips" style={{ marginTop: 12, marginBottom: 4 }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="chip"
              aria-pressed={active.includes(f.id)}
              onClick={() => toggleFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {active.length > 0 && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 8 }}
            onClick={() => {
              setActive([]);
              const p = new URLSearchParams(params);
              p.delete('filter');
              setParams(p, { replace: true });
            }}
          >
            Filter zurücksetzen
          </button>
        )}

        <div className="recipe-grid" style={{ marginTop: 16 }}>
          {results.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="empty-state">
            <div className="big" aria-hidden>🍳</div>
            <h2>Nichts gefunden</h2>
            <p>Versuch es mit weniger Filtern oder einem anderen Suchbegriff.</p>
          </div>
        )}
      </div>
    </>
  );
}
