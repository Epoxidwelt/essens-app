import { createContext, useContext } from 'react';
import type { AppState, Ingredient, MealSlot, Rating, Recipe, Unit, Weekday } from '../types';

/** Zustand des Abgleichs mit dem Familien-Server. */
export interface SyncStatus {
  /**
   * 'aus'        = kein Server erreichbar, die App arbeitet nur auf diesem Gerät
   * 'anmeldung'  = Server verlangt das Familienpasswort
   * 'verbunden'  = alles im Gleichstand
   * 'abgleich'   = holt gerade Änderungen
   */
  state: 'aus' | 'anmeldung' | 'verbunden' | 'abgleich';
  lastSyncAt: string | null;
}

/**
 * Zentraler App-Zustand.
 * Alle Aenderungen laufen ueber diese Actions und werden automatisch gespeichert.
 */
export interface AppContextValue {
  state: AppState;
  ready: boolean;
  sync: SyncStatus;
  /** true, wenn das lokale Speichern zuletzt fehlgeschlagen ist (z. B. Speicher voll). */
  speicherFehler: boolean;
  /* Rezepte: eingebaut + selbst hinzugefügt, zusammengeführt */
  recipes: Recipe[];
  getRecipe: (id: string) => Recipe | undefined;
  getIngredient: (id: string) => Ingredient | undefined;
  /** Legt ein neues eigenes Rezept an (aus Foto, PDF oder von Hand) und liefert es zurück. */
  addCustomRecipe: (
    entwurf: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>,
    neueZutaten: Ingredient[],
  ) => Recipe;
  removeCustomRecipe: (recipeId: string) => void;
  isCustomRecipe: (recipeId: string) => boolean;
  /* Favoriten ("Lecker") */
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string) => void;
  /* Bewertungen */
  ratingsFor: (recipeId: string) => Rating[];
  averageRating: (recipeId: string) => { average: number; count: number; kidsLikedCount: number };
  saveRating: (input: { recipeId: string; stars: number; kidsLiked: boolean | null; comment?: string }) => void;
  /* Einkaufsliste */
  addRecipeToShoppingList: (recipe: Recipe, servings: number) => void;
  removeRecipeFromShoppingList: (recipeId: string) => void;
  addManualItem: (ingredientId: string, amount: number, unit: Unit) => void;
  toggleShoppingItem: (itemId: string) => void;
  deleteShoppingItem: (itemId: string) => void;
  clearCheckedItems: () => void;
  clearShoppingList: () => void;
  /* Wochenplan */
  setPlanEntry: (day: Weekday, slot: MealSlot, recipeId: string, servings: number) => void;
  removePlanEntry: (day: Weekday, slot: MealSlot) => void;
  clearPlan: () => void;
  createWeekShopping: () => number;
  /* Einstellungen & Datensicherung */
  setHousehold: (adults: number, kids: number) => void;
  /** Ersetzt den gesamten Zustand – wird beim Einspielen einer Sicherung genutzt. */
  importState: (next: AppState) => void;
  /** Loescht alle gespeicherten Daten und startet bei null. */
  resetAll: () => void;
  /** Meldet dieses Geraet am Familien-Server an. */
  anmeldenAmServer: (passwort: string) => Promise<{ ok: true } | { ok: false; fehler: string }>;
  /** Meldet dieses Geraet wieder ab (Zugangsmarke loeschen). */
  abmeldenVomServer: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

/** Zugriff auf den App-Zustand in jeder Komponente. */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp muss innerhalb von <AppProvider> verwendet werden');
  return ctx;
}
