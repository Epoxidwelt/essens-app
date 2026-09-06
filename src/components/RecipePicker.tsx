import { useMemo, useState } from 'react';
import type { Recipe } from '../types';
import { RECIPES } from '../data/recipes';
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
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RECIPES;
    return RECIPES.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
    );
  }, [query]);

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
            {recipe.placeholder.emoji}
          </span>
          <span>
            <span style={{ fontWeight: 650, display: 'block' }}>{recipe.name}</span>
            <span className="hint">
              ⏱️ {recipe.timeMinutes} Min · {recipe.nutrition.kcal} kcal
            </span>
          </span>
        </button>
      ))}
      {results.length === 0 && <p className="hint">Kein Rezept gefunden.</p>}
    </Sheet>
  );
}
