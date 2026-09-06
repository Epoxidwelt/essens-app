import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { matchesQuery } from '../lib/filters';
import { plural } from '../lib/text';
import { useApp } from '../store/AppContext';
import { RecipeCard } from '../components/RecipeCard';

const WEEKDAYS = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'] as const;

export function Home() {
  const { state, sync, recipes, getRecipe } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const suggestions = useMemo(
    () => (query.trim() ? recipes.filter((r) => matchesQuery(r, query)).slice(0, 6) : []),
    [query, recipes],
  );

  const todayKey = WEEKDAYS[new Date().getDay()];
  const todayEntries = state.weeklyPlan.items.filter((it) => it.day === todayKey);

  const openShoppingItems = state.shoppingList.items.filter((i) => !i.checked).length;
  const plannedMeals = state.weeklyPlan.items.length;

  const quickRecipes = useMemo(() => recipes.filter((r) => r.timeMinutes <= 20).slice(0, 4), [recipes]);
  const onePotRecipes = useMemo(() => recipes.filter((r) => r.onePot).slice(0, 4), [recipes]);

  return (
    <div className="page">
      <div className="row-between" style={{ marginBottom: 4, alignItems: 'flex-start' }}>
        <div>
          <p className="hint">Familienküche ohne zugesetzten Zucker</p>
          <h1>Was möchtest du heute essen?</h1>
        </div>
        <Link to="/einstellungen" className="icon-btn" aria-label="Einstellungen">
          ⚙️
        </Link>
      </div>

      <div className="search" style={{ marginTop: 14 }}>
        <span aria-hidden>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) navigate(`/rezepte?q=${encodeURIComponent(query)}`);
          }}
          placeholder="Rezept, Zutat oder Kategorie suchen …"
          aria-label="Rezepte suchen"
        />
        {query && (
          <button type="button" className="del" onClick={() => setQuery('')} aria-label="Suche leeren"
            style={{ border: 0, background: 'none', color: 'var(--ink-faint)' }}>
            ✕
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="card" style={{ marginTop: 12, padding: 10 }}>
          {suggestions.map((r) => (
            <Link key={r.id} to={`/rezept/${r.id}`} className="picker-item" style={{ marginBottom: 6 }}>
              <span className={`picker-thumb tone-${r.placeholder.tone}`} aria-hidden>
                {r.placeholder.emoji}
              </span>
              <span>
                <span style={{ fontWeight: 650, display: 'block' }}>{r.name}</span>
                <span className="hint">⏱️ {r.timeMinutes} Min · {r.nutrition.kcal} kcal</span>
              </span>
            </Link>
          ))}
          <button
            type="button"
            className="btn btn-ghost btn-block btn-sm"
            onClick={() => navigate(`/rezepte?q=${encodeURIComponent(query)}`)}
          >
            Alle Treffer anzeigen
          </button>
        </div>
      )}

      {sync.state === 'anmeldung' && (
        <Link
          to="/einstellungen"
          className="card"
          style={{ display: 'block', marginTop: 14, background: 'var(--accent-soft)', borderColor: 'transparent' }}
        >
          <strong>🔒 Anmeldung nötig</strong>
          <p className="hint" style={{ marginTop: 4 }}>
            Familienpasswort eingeben, damit dieses Gerät wieder mitmacht →
          </p>
        </Link>
      )}

      <Link
        to="/rezept-hinzufuegen"
        className="row"
        style={{
          marginTop: 18,
          gap: 8,
          padding: '10px 14px',
          background: 'var(--surface)',
          border: '1px dashed var(--line)',
          borderRadius: 999,
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        📷 Eigenes Rezept per Foto, PDF oder Link hinzufügen
      </Link>

      <div className="tiles" style={{ marginTop: 14 }}>
        <Link to="/rezepte" className="tile tile-recipes">
          <span className="tile-emoji" aria-hidden>🍽️</span>
          <span>
            <span className="tile-name">Rezepte</span>
            <span className="tile-meta" style={{ display: 'block' }}>
              {plural(recipes.length, 'Gericht', 'Gerichte')}
            </span>
          </span>
        </Link>
        <Link to="/lecker" className="tile tile-lecker">
          <span className="tile-emoji" aria-hidden>❤️</span>
          <span>
            <span className="tile-name">Lecker</span>
            <span className="tile-meta" style={{ display: 'block' }}>
              {plural(state.favorites.length, 'Favorit', 'Favoriten')}
            </span>
          </span>
        </Link>
        <Link to="/einkaufsliste" className="tile tile-einkauf">
          {openShoppingItems > 0 && <span className="tile-badge">{openShoppingItems}</span>}
          <span className="tile-emoji" aria-hidden>🛒</span>
          <span>
            <span className="tile-name">Einkaufsliste</span>
            <span className="tile-meta" style={{ display: 'block' }}>
              {openShoppingItems > 0 ? `${openShoppingItems} offen` : 'alles erledigt'}
            </span>
          </span>
        </Link>
        <Link to="/wochenplan" className="tile tile-plan">
          <span className="tile-emoji" aria-hidden>📅</span>
          <span>
            <span className="tile-name">Wochenplan</span>
            <span className="tile-meta" style={{ display: 'block' }}>
              {plannedMeals > 0 ? plural(plannedMeals, 'Mahlzeit', 'Mahlzeiten') : 'noch leer'}
            </span>
          </span>
        </Link>
      </div>

      {todayEntries.length > 0 && (
        <>
          <div className="section-title">
            <h2>Heute geplant</h2>
            <Link to="/wochenplan" className="link">Wochenplan</Link>
          </div>
          <div className="card">
            {todayEntries.map((entry) => {
              const recipe = getRecipe(entry.recipeId);
              if (!recipe) return null;
              return (
                <Link key={entry.id} to={`/rezept/${recipe.id}`} className="slot" style={{ marginBottom: 8 }}>
                  <span className="mini-emoji" aria-hidden>{recipe.placeholder.emoji}</span>
                  <span className="slot-recipe">{recipe.name}</span>
                  <span className="hint">{entry.servings} Port.</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <div className="section-title">
        <h2>In 20 Minuten fertig</h2>
        <Link to="/rezepte?filter=unter-20" className="link">Alle</Link>
      </div>
      <div className="recipe-grid">
        {quickRecipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>

      <div className="section-title">
        <h2>Nur ein Topf</h2>
        <Link to="/rezepte?filter=one-pot" className="link">Alle</Link>
      </div>
      <div className="recipe-grid">
        {onePotRecipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}
