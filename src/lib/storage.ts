import type { AppState } from '../types';

/**
 * Speicher-Schicht.
 *
 * Die App spricht ausschliesslich ueber dieses Interface mit dem Speicher.
 * Heute steckt localStorage dahinter; um spaeter auf eine echte Datenbank
 * (z. B. Supabase) umzustellen, muss nur eine zweite Implementierung von
 * `StateRepository` geschrieben und in `repository` eingesetzt werden –
 * die Komponenten bleiben unveraendert.
 */
export interface StateRepository {
  load(): Promise<AppState | null>;
  save(state: AppState): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY = 'essens-app.state.v1';

export class LocalStorageRepository implements StateRepository {
  async load(): Promise<AppState | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppState) : null;
    } catch {
      // Privater Modus / gesperrter Speicher: App laeuft dann ohne Persistenz weiter.
      return null;
    }
  }

  async save(state: AppState): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignorieren */
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignorieren */
    }
  }
}

export const repository: StateRepository = new LocalStorageRepository();

/** Montag der aktuellen Woche als ISO-Datum. */
export function currentWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Montag = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/** Startzustand fuer eine frische Installation. */
export function createInitialState(): AppState {
  return {
    user: {
      id: 'local-user',
      name: 'Familie',
      household: { adults: 2, kids: 2 },
      defaultServings: 4,
    },
    favorites: [],
    ratings: [],
    shoppingList: {
      id: 'list-1',
      userId: 'local-user',
      name: 'Einkaufsliste',
      items: [],
      updatedAt: new Date().toISOString(),
    },
    weeklyPlan: {
      id: 'plan-1',
      userId: 'local-user',
      weekStart: currentWeekStart(),
      items: [],
    },
    customRecipes: [],
    customIngredients: [],
  };
}

/** Ergaenzt fehlende Felder, damit aeltere gespeicherte Staende weiter laden. */
export function hydrate(stored: AppState | null): AppState {
  const initial = createInitialState();
  if (!stored) return initial;
  return {
    user: { ...initial.user, ...stored.user },
    favorites: stored.favorites ?? [],
    ratings: stored.ratings ?? [],
    shoppingList: { ...initial.shoppingList, ...stored.shoppingList, items: stored.shoppingList?.items ?? [] },
    weeklyPlan: { ...initial.weeklyPlan, ...stored.weeklyPlan, items: stored.weeklyPlan?.items ?? [] },
    customRecipes: stored.customRecipes ?? [],
    customIngredients: stored.customIngredients ?? [],
  };
}
