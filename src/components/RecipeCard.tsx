import { Link } from 'react-router-dom';
import type { Recipe } from '../types';
import { useApp } from '../store/AppContext';
import { Stars } from './Stars';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { isFavorite, toggleFavorite, averageRating } = useApp();
  const fav = isFavorite(recipe.id);
  const rating = averageRating(recipe.id);

  return (
    <Link to={`/rezept/${recipe.id}`} className="recipe-card">
      <div className={`recipe-thumb tone-${recipe.placeholder.tone}`}>
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.name} />
        ) : (
          <span aria-hidden>{recipe.placeholder.emoji}</span>
        )}
        <button
          type="button"
          className="fav-btn"
          aria-label={fav ? 'Aus Lecker entfernen' : 'Zu Lecker hinzufügen'}
          aria-pressed={fav}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(recipe.id);
          }}
        >
          {fav ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="recipe-body">
        <div className="name">{recipe.name}</div>
        <p className="desc">{recipe.description}</p>
        <div className="recipe-meta">
          <span>⏱️ {recipe.timeMinutes} Min</span>
          <span>🔥 {recipe.nutrition.kcal} kcal</span>
          {recipe.onePot && <span>🥘 One Pot</span>}
          {rating.count > 0 && (
            <span className="row" style={{ gap: 4 }}>
              <Stars value={rating.average} /> {rating.average}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
