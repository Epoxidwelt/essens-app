import { Link } from 'react-router-dom';
import { plural } from '../lib/text';
import { useApp } from '../store/AppContext';
import { RecipeCard } from '../components/RecipeCard';

export function Favorites() {
  const { state, getRecipe } = useApp();
  const recipes = state.favorites
    .map((f) => getRecipe(f.recipeId))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <>
      <div className="page-header">
        <h1>❤️ Lecker</h1>
        <span className="spacer" />
        <span className="sub">{plural(recipes.length, 'Rezept', 'Rezepte')}</span>
      </div>
      <div className="page" style={{ paddingTop: 4 }}>
        {recipes.length === 0 ? (
          <div className="empty-state">
            <div className="big" aria-hidden>❤️</div>
            <h2>Noch keine Favoriten</h2>
            <p>Tippe bei einem Rezept auf das Herz – es landet dann hier.</p>
            <Link to="/rezepte" className="btn btn-primary" style={{ marginTop: 16 }}>
              Rezepte entdecken
            </Link>
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
