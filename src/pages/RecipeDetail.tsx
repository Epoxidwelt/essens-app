import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatQuantity, scaleAmount } from '../lib/quantity';
import { istYoutubeLink } from '../lib/youtube';
import { useApp } from '../store/AppContext';
import { describeHousehold, plural } from '../lib/text';
import { Sheet } from '../components/Sheet';
import { Stars } from '../components/Stars';
import { useToast } from '../components/Toast';
import type { MealSlot, Weekday } from '../types';

const DAYS: Array<{ id: Weekday; label: string }> = [
  { id: 'mo', label: 'Montag' },
  { id: 'di', label: 'Dienstag' },
  { id: 'mi', label: 'Mittwoch' },
  { id: 'do', label: 'Donnerstag' },
  { id: 'fr', label: 'Freitag' },
  { id: 'sa', label: 'Samstag' },
  { id: 'so', label: 'Sonntag' },
];

const SLOTS: Array<{ id: MealSlot; label: string }> = [
  { id: 'fruehstueck', label: 'Frühstück' },
  { id: 'mittag', label: 'Mittagessen' },
  { id: 'abend', label: 'Abendessen' },
];

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    state,
    getRecipe,
    getIngredient,
    isCustomRecipe,
    removeCustomRecipe,
    isFavorite,
    toggleFavorite,
    addRecipeToShoppingList,
    saveRating,
    ratingsFor,
    averageRating,
    setPlanEntry,
  } = useApp();
  const { showToast, toast } = useToast();

  const recipe = id ? getRecipe(id) : undefined;
  const eigenesRezept = id ? isCustomRecipe(id) : false;
  const [zeigeLoeschen, setZeigeLoeschen] = useState(false);
  // Startet mit der in den Einstellungen hinterlegten Familiengroesse.
  const [servings, setServings] = useState(state.user.defaultServings);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [stars, setStars] = useState(0);
  const [kidsLiked, setKidsLiked] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [planDay, setPlanDay] = useState<Weekday>('mo');
  const [planSlot, setPlanSlot] = useState<MealSlot>('abend');

  if (!recipe) {
    return (
      <div className="empty-state">
        <div className="big" aria-hidden>🤔</div>
        <h2>Rezept nicht gefunden</h2>
        <Link to="/rezepte" className="btn btn-primary" style={{ marginTop: 16 }}>
          Zu den Rezepten
        </Link>
      </div>
    );
  }

  const naehrwerteBekannt = recipe.nutrition.kcal > 0;
  const istVideoQuelle = istYoutubeLink(recipe.videoUrl ?? '');
  const quellenEmoji = recipe.videoUrl ? (istVideoQuelle ? '📺' : '🔗') : '📷';
  const fav = isFavorite(recipe.id);
  const rating = averageRating(recipe.id);
  const reviews = ratingsFor(recipe.id);
  const factor = servings / recipe.baseServings;

  return (
    <>
      <div className={`hero tone-${recipe.placeholder.tone}`}>
        <button type="button" className="icon-btn back" onClick={() => navigate(-1)} aria-label="Zurück">
          ←
        </button>
        <button
          type="button"
          className="fav-btn"
          aria-pressed={fav}
          aria-label={fav ? 'Aus Lecker entfernen' : 'Zu Lecker hinzufügen'}
          onClick={() => {
            toggleFavorite(recipe.id);
            showToast(fav ? 'Aus „Lecker“ entfernt' : '❤️ Zu „Lecker“ gespeichert');
          }}
        >
          {fav ? '❤️' : '🤍'}
        </button>
        {recipe.image ? <img src={recipe.image} alt={recipe.name} /> : <span aria-hidden>{recipe.placeholder.emoji}</span>}
      </div>

      <div className="detail-sheet">
        <h1>{recipe.name}</h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{recipe.description}</p>

        <div className="tags" style={{ marginTop: 12 }}>
          {recipe.noAddedSugar && <span className="tag tag-green">✓ Ohne zugesetzten Zucker</span>}
          {recipe.kidFriendly && <span className="tag">👨‍👩‍👧‍👦 Kinderfreundlich</span>}
          {recipe.onePot && <span className="tag tag-accent">🥘 One Pot</span>}
          {recipe.glutenFree && <span className="tag tag-green">🌾 Glutenfrei</span>}
          <span className="tag">📶 {recipe.difficulty}</span>
          {eigenesRezept && <span className="tag">{quellenEmoji} Eigenes Rezept</span>}
        </div>

        {recipe.videoUrl && (
          <a
            href={recipe.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-block"
            style={{ marginTop: 12 }}
          >
            {istVideoQuelle ? '▶️ Video auf YouTube ansehen' : '🔗 Zur Original-Webseite'}
          </a>
        )}

        <div className="row" style={{ marginTop: 12, gap: 8 }}>
          {rating.count > 0 ? (
            <>
              <Stars value={rating.average} />
              <span style={{ fontWeight: 650 }}>{rating.average}</span>
              <span className="hint">
                ({rating.count} {rating.count === 1 ? 'Bewertung' : 'Bewertungen'}
                {rating.kidsLikedCount > 0 ? ` · 👍 ${rating.kidsLikedCount}× Kinder` : ''})
              </span>
            </>
          ) : (
            <span className="hint">Noch nicht bewertet</span>
          )}
        </div>

        <div className="facts">
          <div className="fact">
            <div className="v">{recipe.timeMinutes}′</div>
            <div className="k">Zeit</div>
          </div>
          {naehrwerteBekannt ? (
            <>
              <div className="fact">
                <div className="v">{Math.round(recipe.nutrition.kcal)}</div>
                <div className="k">kcal / Portion</div>
              </div>
              <div className="fact">
                <div className="v">{recipe.nutrition.protein} g</div>
                <div className="k">Eiweiß</div>
              </div>
              <div className="fact">
                <div className="v">{recipe.nutrition.carbs} g</div>
                <div className="k">Kohlenhydrate</div>
              </div>
            </>
          ) : (
            <div className="fact" style={{ gridColumn: 'span 3' }}>
              <div className="k">Nährwerte unbekannt</div>
            </div>
          )}
        </div>
        {naehrwerteBekannt && (
          <p className="hint" style={{ marginTop: 8 }}>
            Fett: {recipe.nutrition.fat} g pro Portion
          </p>
        )}

        <div className="action-bar">
          <button
            type="button"
            className={fav ? 'btn btn-accent' : 'btn'}
            onClick={() => {
              toggleFavorite(recipe.id);
              showToast(fav ? 'Aus „Lecker“ entfernt' : '❤️ Zu „Lecker“ gespeichert');
            }}
          >
            {fav ? '❤️ Gespeichert' : '❤️ Lecker'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              addRecipeToShoppingList(recipe, servings);
              showToast(`🛒 ${plural(recipe.ingredients.length, 'Zutat', 'Zutaten')} übernommen`);
            }}
          >
            🛒 Einkaufsliste
          </button>
          <button type="button" className="btn" onClick={() => setShowPlan(true)}>
            📅 Wochenplan
          </button>
          <button type="button" className="btn" onClick={() => setShowRating(true)}>
            ⭐ Bewerten
          </button>
        </div>

        <div className="section-title">
          <h2>Zutaten</h2>
        </div>
        <div className="card">
          <div className="servings">
            <span className="label">
              Portionen
              {servings === state.user.defaultServings
                ? ` (${describeHousehold(state.user.household.adults, state.user.household.kids)})`
                : ''}
            </span>
            <div className="stepper">
              <button
                type="button"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                aria-label="Weniger Portionen"
              >
                −
              </button>
              <span className="count">{servings}</span>
              <button
                type="button"
                onClick={() => setServings((s) => Math.min(12, s + 1))}
                aria-label="Mehr Portionen"
              >
                +
              </button>
            </div>
          </div>

          <ul className="ing-list">
            {recipe.ingredients.map((ri) => {
              const ingredient = getIngredient(ri.ingredientId);
              const amount = scaleAmount(ri.amount, ri.unit, recipe.baseServings, servings);
              return (
                <li key={ri.ingredientId + ri.unit}>
                  <span>
                    {ingredient?.name ?? ri.ingredientId}
                    {ri.note && <span className="note"> · {ri.note}</span>}
                  </span>
                  <span className="amount">{formatQuantity(amount, ri.unit)}</span>
                </li>
              );
            })}
          </ul>
          {factor !== 1 && (
            <p className="hint" style={{ marginTop: 10 }}>
              Mengen umgerechnet von {recipe.baseServings} auf {servings} Portionen.
            </p>
          )}
          {recipe.glutenFree && (
            <p className="hint" style={{ marginTop: 10 }}>
              🌾 Die Zutaten dieses Rezepts enthalten kein Gluten. Bei abgepackten
              Sachen – Brühe, Haferflocken, Nudeln, Senf – trotzdem kurz auf die
              Packung schauen: Nur was ausdrücklich „glutenfrei" trägt, ist es
              auch sicher.
            </p>
          )}
        </div>

        <div className="section-title">
          <h2>Zubereitung</h2>
          {doneSteps.length > 0 && (
            <button type="button" className="link" style={{ border: 0, background: 'none' }} onClick={() => setDoneSteps([])}>
              zurücksetzen
            </button>
          )}
        </div>
        <div className="card">
          <ol className="steps">
            {recipe.steps.map((step, index) => (
              <li
                key={index}
                className={doneSteps.includes(index) ? 'done' : ''}
                onClick={() =>
                  setDoneSteps((prev) =>
                    prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
                  )
                }
              >
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {recipe.tips && (
          <div className="card" style={{ marginTop: 14, background: 'var(--brand-soft)', borderColor: 'transparent' }}>
            <h3>💡 Tipp</h3>
            <p style={{ marginTop: 6 }}>{recipe.tips}</p>
          </div>
        )}

        {reviews.length > 0 && (
          <>
            <div className="section-title">
              <h2>Eure Bewertungen</h2>
            </div>
            <div className="stack">
              {reviews
                .slice()
                .reverse()
                .map((r) => (
                  <div className="card" key={r.id}>
                    <div className="row" style={{ gap: 8 }}>
                      <Stars value={r.stars} />
                      {r.kidsLiked !== null && (
                        <span className="tag">{r.kidsLiked ? '👍 Kindern geschmeckt' : '👎 Kindern nicht geschmeckt'}</span>
                      )}
                    </div>
                    {r.comment && <p style={{ marginTop: 8 }}>„{r.comment}“</p>}
                    <p className="hint" style={{ marginTop: 6 }}>
                      {new Date(r.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                ))}
            </div>
          </>
        )}

        {eigenesRezept && (
          <div className="card" style={{ marginTop: 14 }}>
            {zeigeLoeschen ? (
              <>
                <p style={{ fontSize: 14 }}>Dieses eigene Rezept wirklich löschen?</p>
                <div className="row" style={{ marginTop: 10, gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={() => {
                      removeCustomRecipe(recipe.id);
                      showToast('Rezept gelöscht');
                      navigate('/rezepte');
                    }}
                  >
                    Ja, löschen
                  </button>
                  <button type="button" className="btn" onClick={() => setZeigeLoeschen(false)}>
                    Abbrechen
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setZeigeLoeschen(true)}>
                🗑️ Eigenes Rezept löschen
              </button>
            )}
          </div>
        )}

        <div style={{ height: 24 }} />
      </div>

      {showRating && (
        <Sheet title="Wie war’s?" onClose={() => setShowRating(false)}>
          <p className="hint">Bewerte {recipe.name}, nachdem ihr es gekocht habt.</p>
          <div className="star-input" style={{ margin: '16px 0' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                data-off={n > stars}
                aria-label={`${n} Sterne`}
                onClick={() => setStars(n)}
              >
                {n <= stars ? '★' : '☆'}
              </button>
            ))}
          </div>

          <h3>Hat es den Kindern geschmeckt?</h3>
          <div className="row" style={{ marginTop: 10, marginBottom: 18 }}>
            <button
              type="button"
              className={kidsLiked === true ? 'btn btn-primary' : 'btn'}
              onClick={() => setKidsLiked(kidsLiked === true ? null : true)}
            >
              👍 Ja
            </button>
            <button
              type="button"
              className={kidsLiked === false ? 'btn btn-accent' : 'btn'}
              onClick={() => setKidsLiked(kidsLiked === false ? null : false)}
            >
              👎 Nein
            </button>
          </div>

          <h3>Kommentar (optional)</h3>
          <textarea
            className="textarea"
            style={{ marginTop: 8 }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="z. B. „War super lecker.“"
          />

          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ marginTop: 16 }}
            disabled={stars === 0}
            onClick={() => {
              saveRating({ recipeId: recipe.id, stars, kidsLiked, comment: comment.trim() || undefined });
              setShowRating(false);
              setStars(0);
              setKidsLiked(null);
              setComment('');
              showToast('⭐ Bewertung gespeichert');
            }}
          >
            Bewertung speichern
          </button>
        </Sheet>
      )}

      {showPlan && (
        <Sheet title="Zum Wochenplan hinzufügen" onClose={() => setShowPlan(false)}>
          <h3>Tag</h3>
          <div className="chips" style={{ marginTop: 8, marginBottom: 14 }}>
            {DAYS.map((d) => (
              <button
                key={d.id}
                type="button"
                className="chip"
                aria-pressed={planDay === d.id}
                onClick={() => setPlanDay(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <h3>Mahlzeit</h3>
          <div className="chips" style={{ marginTop: 8, marginBottom: 14 }}>
            {SLOTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="chip"
                aria-pressed={planSlot === s.id}
                onClick={() => setPlanSlot(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="servings">
            <span className="label">Portionen</span>
            <div className="stepper">
              <button type="button" onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="Weniger">−</button>
              <span className="count">{servings}</span>
              <button type="button" onClick={() => setServings((s) => Math.min(12, s + 1))} aria-label="Mehr">+</button>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ marginTop: 16 }}
            onClick={() => {
              setPlanEntry(planDay, planSlot, recipe.id, servings);
              setShowPlan(false);
              showToast(`📅 ${DAYS.find((d) => d.id === planDay)?.label} eingeplant`);
            }}
          >
            Einplanen
          </button>
          <p className="hint" style={{ marginTop: 10, textAlign: 'center' }}>
            Bereits {plural(state.weeklyPlan.items.length, 'Mahlzeit', 'Mahlzeiten')} diese Woche geplant.
          </p>
        </Sheet>
      )}

      {toast}
    </>
  );
}
