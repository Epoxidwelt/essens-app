/**
 * Datenmodell der Essens App.
 *
 * Die Typen sind bewusst so geschnitten, dass sie 1:1 auf Datenbank-Tabellen
 * (z. B. Supabase/Postgres) abbildbar sind: jede Entitaet hat eine id, Relationen
 * laufen ueber Fremdschluessel-Felder (recipeId, userId, ...).
 */

/* ---------------------------------------------------------------- Zutaten */

/** Einheiten, die in Rezepten vorkommen duerfen. */
export type Unit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'Stk'
  | 'EL'
  | 'TL'
  | 'Prise'
  | 'Bund'
  | 'Zehe'
  | 'Dose'
  | 'Packung'
  | 'Scheibe';

/** Abteilungen im Supermarkt – steuert die Gruppierung der Einkaufsliste. */
export type ShopCategory =
  | 'obst-gemuese'
  | 'fleisch'
  | 'milchprodukte'
  | 'eier'
  | 'getreide'
  | 'konserven'
  | 'gewuerze'
  | 'tiefkuehl'
  | 'sonstiges';

/**
 * Stammdaten einer Zutat (Tabelle `ingredients`).
 * Der Slug ist der Merge-Schluessel: gleiche Zutat aus mehreren Rezepten
 * wird ueber ihn in der Einkaufsliste zusammengerechnet.
 */
export interface Ingredient {
  id: string;
  name: string;
  category: ShopCategory;
  /** Vorratszutat (Salz, Oel ...) – kann in der Einkaufsliste ausgeblendet werden. */
  pantry?: boolean;
  /**
   * Platzhalter fuer die spaetere Haendleranbindung: hier landen spaeter
   * GTIN/EAN oder haendlerspezifische Produkt-IDs.
   */
  gtin?: string;
  vendorRefs?: VendorProductRef[];
}

/** Vorbereitung fuer die spaetere Bestellfunktion (Rewe, Flink, Picnic ...). */
export interface VendorProductRef {
  vendor: string;
  productId: string;
  /** Gebindegroesse des Haendlerprodukts, z. B. 500 g Packung. */
  packSize?: number;
  packUnit?: Unit;
}

/** Zutat innerhalb eines Rezeptes (Tabelle `recipe_ingredients`). */
export interface RecipeIngredient {
  /** Verweist auf Ingredient.id */
  ingredientId: string;
  amount: number;
  unit: Unit;
  /** Zusatz wie "gewuerfelt", "frisch gerieben" */
  note?: string;
  /** Diese Zutat nicht mit auf die Einkaufsliste nehmen (z. B. Wasser). */
  skipShopping?: boolean;
}

/* ---------------------------------------------------------------- Rezepte */

export type Difficulty = 'einfach' | 'mittel' | 'anspruchsvoll';

export type RecipeCategory =
  | 'one-pot'
  | 'haehnchen'
  | 'hackfleisch'
  | 'vegetarisch'
  | 'pasta'
  | 'reis'
  | 'kartoffeln'
  | 'auflauf'
  | 'fruehstueck'
  | 'unter-20'
  | 'unter-30'
  | 'kinderliebling'
  | 'proteinreich'
  | 'suppe-eintopf'
  | 'ofen';

export interface Nutrition {
  /** je Portion */
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

/** Tabelle `recipes`. */
export interface Recipe {
  id: string;
  name: string;
  description: string;
  /** Bildquelle; solange keine Fotos vorhanden sind, wird ein Platzhalter gerendert. */
  image?: string;
  /** Farb-/Emoji-Platzhalter, solange kein Foto hinterlegt ist. */
  placeholder: { emoji: string; tone: 'green' | 'tomato' | 'sun' | 'berry' | 'cream' | 'herb' };
  /** Mengen im Rezept gelten fuer diese Portionszahl (Standard: 4 = 2 Erwachsene + 2 Kinder). */
  baseServings: number;
  /** Gesamtzeit in Minuten. */
  timeMinutes: number;
  difficulty: Difficulty;
  ingredients: RecipeIngredient[];
  steps: string[];
  nutrition: Nutrition;
  categories: RecipeCategory[];
  /** In dieser App immer true – wird trotzdem explizit gefuehrt. */
  noAddedSugar: boolean;
  kidFriendly: boolean;
  onePot: boolean;
  tips?: string;
  /** Nur bei selbst hinzugefügten Rezepten gesetzt – dient dem Geräte-Abgleich. */
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------ Nutzer & Bewertung */

export interface User {
  id: string;
  name: string;
  household: { adults: number; kids: number };
  /** Standard-Portionszahl fuer neue Rezeptansichten. */
  defaultServings: number;
}

/** Tabelle `favorites` ("Lecker"). */
export interface Favorite {
  userId: string;
  recipeId: string;
  createdAt: string;
}

/** Tabelle `ratings`. */
export interface Rating {
  id: string;
  userId: string;
  recipeId: string;
  /** 1–5 Sterne */
  stars: number;
  /** Hat es den Kindern geschmeckt? */
  kidsLiked: boolean | null;
  comment?: string;
  createdAt: string;
}

/* -------------------------------------------------------- Einkaufsliste */

/**
 * Tabelle `shopping_list_items`.
 * Mengen werden immer in der Basiseinheit gespeichert (g / ml / Stueck-artig),
 * damit das Zusammenrechnen verlustfrei funktioniert.
 */
export interface ShoppingListItem {
  id: string;
  ingredientId: string;
  /** Menge in der gespeicherten Einheit. */
  amount: number;
  unit: Unit;
  checked: boolean;
  /** Woher stammt die Position – Grundlage fuer "Rezept wieder entfernen". */
  sources: Array<{ recipeId: string; servings: number }>;
  /** Manuell hinzugefuegte Position ohne Rezeptbezug. */
  manual?: boolean;
  createdAt: string;
}

/** Tabelle `shopping_lists`. Aktuell existiert genau eine aktive Liste je Nutzer. */
export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  items: ShoppingListItem[];
  updatedAt: string;
}

/* ------------------------------------------------------------ Wochenplan */

export type Weekday = 'mo' | 'di' | 'mi' | 'do' | 'fr' | 'sa' | 'so';
export type MealSlot = 'fruehstueck' | 'mittag' | 'abend';

/** Tabelle `weekly_plan_items`. */
export interface WeeklyPlanItem {
  id: string;
  day: Weekday;
  slot: MealSlot;
  recipeId: string;
  servings: number;
}

/** Tabelle `weekly_plans`. */
export interface WeeklyPlan {
  id: string;
  userId: string;
  /** ISO-Datum des Montags dieser Woche. */
  weekStart: string;
  items: WeeklyPlanItem[];
}

/* -------------------------------------------------- Persistierter Zustand */

export interface AppState {
  user: User;
  favorites: Favorite[];
  ratings: Rating[];
  shoppingList: ShoppingList;
  weeklyPlan: WeeklyPlan;
  /** Selbst hinzugefügte Rezepte (aus Foto, PDF oder von Hand). */
  customRecipes: Recipe[];
  /** Zutaten, die dabei neu angelegt wurden und in keiner Stammliste stehen. */
  customIngredients: Ingredient[];
}
