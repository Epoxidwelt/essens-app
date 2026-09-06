import { useMemo, useState } from 'react';
import type { Recipe } from '../types';
import { useApp } from '../store/AppContext';
import { Sheet } from './Sheet';

/** Auswahl-Sheet, um dem Wochenplan ein Rezept zuzuordnen. */
export function RecipePicker({
  title,
  onPick,
  onClose,
}: {
  title: string;
  onPick: (recipe: Recipe) => void;
  onClose: () => void;
}) {
  const { recipes } = useApp();
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
    );
  }, [query, recipes]);

  return (
    <Sheet title={title} onClose={onClose}>
      <div className="search" style={{ marginBottom: 14 }}>
        <span aria-hidden>🔍</span>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rezept suchen …"
        />
      </div>
      {results.map((recipe) => (
        <button
          key={recipe.id}
          type="button"
          className="picker-item"
          onClick={() => onPick(recipe)}
        >
          <span className={`picker-thumb tone-${recipe.placeholder.tone}`} aria-hidden>
            {recipe.image ? (
              <img src={recipe.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
            ) : (
              recipe.placeholder.emoji
            )}
          </span>
          <span>
            <span style={{ fontWeight: 650, display: 'block' }}>{recipe.name}</span>
            <span className="hint">
              ⏱️ {recipe.timeMinutes} Min{recipe.nutrition.kcal > 0 ? ` · ${recipe.nutrition.kcal} kcal` : ''}
            </span>
          </span>
        </button>
      ))}
      {results.length === 0 && <p className="hint">Kein Rezept gefunden.</p>}
    </Sheet>
  );
}
