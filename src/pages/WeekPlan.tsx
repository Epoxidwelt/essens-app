import { useState } from 'react';
import { Link } from 'react-router-dom';
import { plural } from '../lib/text';
import { useApp } from '../store/AppContext';
import { RecipePicker } from '../components/RecipePicker';
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
  { id: 'mittag', label: 'Mittag' },
  { id: 'abend', label: 'Abend' },
];

export function WeekPlan() {
  const { state, getRecipe, setPlanEntry, removePlanEntry, clearPlan, createWeekShopping } = useApp();
  const { showToast, toast } = useToast();
  const [target, setTarget] = useState<{ day: Weekday; slot: MealSlot } | null>(null);

  const plan = state.weeklyPlan;
  const entryFor = (day: Weekday, slot: MealSlot) =>
    plan.items.find((it) => it.day === day && it.slot === slot);

  return (
    <>
      <div className="page-header">
        <h1>📅 Wochenplan</h1>
        <span className="spacer" />
        <span className="sub">{plural(plan.items.length, 'Mahlzeit', 'Mahlzeiten')}</span>
      </div>

      <div className="page" style={{ paddingTop: 4 }}>
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={plan.items.length === 0}
          onClick={() => {
            const count = createWeekShopping();
            showToast(`🛒 ${plural(count, 'Rezept', 'Rezepte')} zur Einkaufsliste hinzugefügt`);
          }}
        >
          🛒 Wocheneinkauf erstellen
        </button>
        <p className="hint" style={{ margin: '8px 0 18px', textAlign: 'center' }}>
          Übernimmt alle geplanten Rezepte und rechnet gleiche Zutaten zusammen.
        </p>

        {DAYS.map((day) => (
          <div className="day-card" key={day.id}>
            <h3>{day.label}</h3>
            {SLOTS.map((slot) => {
              const entry = entryFor(day.id, slot.id);
              const recipe = entry ? getRecipe(entry.recipeId) : undefined;
              return (
                <div className="slot" key={slot.id}>
                  <span className="slot-name">{slot.label}</span>
                  {recipe && entry ? (
                    <>
                      <span className="mini-emoji" aria-hidden>{recipe.placeholder.emoji}</span>
                      <Link to={`/rezept/${recipe.id}`} className="slot-recipe">
                        {recipe.name}
                        <span className="hint" style={{ display: 'block', fontWeight: 500 }}>
                          {entry.servings} Portionen · ⏱️ {recipe.timeMinutes} Min
                        </span>
                      </Link>
                      <button
                        type="button"
                        className="del"
                        style={{ border: 0, background: 'none', color: 'var(--ink-faint)', fontSize: 18 }}
                        aria-label={`${recipe.name} entfernen`}
                        onClick={() => removePlanEntry(day.id, slot.id)}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="slot-recipe empty"
                      style={{ border: 0, background: 'none', textAlign: 'left' }}
                      onClick={() => setTarget({ day: day.id, slot: slot.id })}
                    >
                      + Rezept wählen
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {plan.items.length > 0 && (
          <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={clearPlan}>
            Wochenplan leeren
          </button>
        )}
      </div>

      {target && (
        <RecipePicker
          title={`${DAYS.find((d) => d.id === target.day)?.label} · ${
            SLOTS.find((s) => s.id === target.slot)?.label
          }`}
          onClose={() => setTarget(null)}
          onPick={(recipe) => {
            setPlanEntry(target.day, target.slot, recipe.id, state.user.defaultServings);
            setTarget(null);
            showToast(`${recipe.name} eingeplant`);
          }}
        />
      )}

      {toast}
    </>
  );
}
