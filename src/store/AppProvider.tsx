import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppState, Ingredient, MealSlot, Recipe, Unit, Weekday } from '../types';
import { AppContext, type AppContextValue } from './AppContext';
import { addItems, addRecipe, pendingItemsFromPlan, removeRecipe } from '../lib/shopping';
import { alleRezepte, findeRezept, findeZutat } from '../lib/recipes';
import { createInitialState, hydrate, repository } from '../lib/storage';
import { mergeStates, sameContent } from '../lib/sync';
import { abmelden, anmelden, fetchState, fetchVersion, pushState } from '../lib/syncClient';
import type { SyncStatus } from './AppContext';


export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(createInitialState);
  const [ready, setReady] = useState(false);
  const [sync, setSync] = useState<SyncStatus>({ state: 'aus', lastSyncAt: null });
  /** true, wenn das lokale Speichern zuletzt fehlgeschlagen ist (z. B. Speicher voll). */
  const [speicherFehler, setSpeicherFehler] = useState(false);
  const loaded = useRef(false);
  /** Zuletzt vom Server bestaetigte Version – erkennt Aenderungen anderer Geraete. */
  const serverVersion = useRef<number | null>(null);
  /** Es gibt lokale Aenderungen, die der Server noch nicht kennt. */
  const ungesendet = useRef(false);
  /** Immer der aktuelle Zustand, auch innerhalb von Intervallen. */
  const aktuellerStand = useRef(state);
  aktuellerStand.current = state;
  /** Wie oft der Server hintereinander nicht erreichbar war. */
  const erfolgloseVersuche = useRef(0);

  /** Sendet den eigenen Stand und merkt sich die neue Version. */
  const senden = useCallback(async (naechster: AppState) => {
    const ergebnis = await pushState(naechster);
    if (ergebnis.art !== 'ok') {
      // Nicht erreichbar oder Anmeldung noetig – die Aenderung bleibt vorgemerkt.
      const neu = ergebnis.art === 'anmeldung' ? 'anmeldung' : 'aus';
      setSync((prev) => (prev.state === neu ? prev : { ...prev, state: neu }));
      return false;
    }
    serverVersion.current = ergebnis.wert;
    ungesendet.current = false;
    setSync({ state: 'verbunden', lastSyncAt: new Date().toISOString() });
    return true;
  }, []);

  /**
   * Ein Abgleichdurchlauf:
   * erst fremde Aenderungen holen, dann eigene nachreichen.
   */
  const abgleichen = useCallback(async () => {
    const status = await fetchVersion();
    if (status.art !== 'ok') {
      erfolgloseVersuche.current += 1;
      const neu = status.art === 'anmeldung' ? 'anmeldung' : 'aus';
      setSync((prev) => (prev.state === neu ? prev : { ...prev, state: neu }));
      return;
    }
    erfolgloseVersuche.current = 0;
    const version = status.wert;

    if (serverVersion.current === null || version !== serverVersion.current) {
      setSync((prev) => ({ ...prev, state: 'abgleich' }));
      const antwort = await fetchState();
      if (antwort.art === 'anmeldung') {
        setSync((prev) => ({ ...prev, state: 'anmeldung' }));
        return;
      }
      if (antwort.art === 'ok') {
        const fern = antwort.wert;
        serverVersion.current = fern.version;
        if (fern.state) {
          const fremd = hydrate(fern.state);
          const zusammen = mergeStates(aktuellerStand.current, fremd);
          if (!sameContent(aktuellerStand.current, zusammen)) {
            // Der fremde Stand bringt Neues: uebernehmen und weitergeben.
            aktuellerStand.current = zusammen;
            ungesendet.current = true;
            setState(zusammen);
          } else if (!sameContent(fremd, zusammen)) {
            // Wir wissen mehr als der Server – nachreichen.
            ungesendet.current = true;
          }
        } else {
          ungesendet.current = true;
        }
      }
    }

    if (ungesendet.current) {
      await senden(aktuellerStand.current);
    } else {
      setSync((prev) =>
        prev.state === 'verbunden' ? prev : { state: 'verbunden', lastSyncAt: prev.lastSyncAt },
      );
    }
  }, [senden]);

  // Beim Start: lokalen Stand laden, danach einmal abgleichen.
  useEffect(() => {
    let abgebrochen = false;
    (async () => {
      const lokal = hydrate(await repository.load());
      if (abgebrochen) return;
      aktuellerStand.current = lokal;
      setState(lokal);
      loaded.current = true;
      setReady(true);
      ungesendet.current = true;
      void abgleichen();
    })();
    return () => {
      abgebrochen = true;
    };
  }, [abgleichen]);

  // Jede Aenderung sofort lokal sichern – Favoriten & Bewertungen ueberleben den Neustart.
  // Schlaegt das fehl (z. B. Speicher voll durch Fotos bei eigenen Rezepten),
  // wird das sichtbar gemacht statt den Datenverlust stillschweigend zu riskieren.
  useEffect(() => {
    if (!loaded.current) return;
    let aktuell = true;
    void repository.save(state).then((erfolgreich) => {
      if (aktuell) setSpeicherFehler(!erfolgreich);
    });
    return () => {
      aktuell = false;
    };
  }, [state]);

  // ... und kurz darauf zum Familien-Server schicken (gebuendelt).
  useEffect(() => {
    if (!loaded.current) return;
    ungesendet.current = true;
    const timer = setTimeout(() => {
      void senden(state);
    }, 700);
    return () => clearTimeout(timer);
  }, [state, senden]);

  // Regelmaessig nachsehen, ob ein anderes Geraet etwas geaendert hat –
  // und dabei auch Aenderungen nachreichen, die offline entstanden sind.
  useEffect(() => {
    if (!ready) return;
    let aktiv = true;
    let timer: ReturnType<typeof setTimeout>;

    // Läuft gar kein Server (z. B. wenn die App nur als Webseite liegt),
    // wird nach einigen vergeblichen Versuchen deutlich seltener nachgefragt.
    const naechsterAbstand = () => (erfolgloseVersuche.current >= 3 ? 60_000 : 5_000);

    const lauf = async () => {
      if (!aktiv) return;
      await abgleichen();
      if (!aktiv) return;
      timer = setTimeout(lauf, naechsterAbstand());
    };
    timer = setTimeout(lauf, 5_000);

    // Im Hintergrund drosseln Handys und Browser solche Timer stark.
    // Deshalb sofort abgleichen, sobald die App wieder sichtbar ist oder
    // das Netz zurueckkommt – genau der Moment nach dem Einkauf.
    const beiRueckkehr = () => {
      if (document.visibilityState !== 'visible') return;
      // Beim Zurückkommen wieder häufiger nachsehen.
      erfolgloseVersuche.current = 0;
      void abgleichen();
    };
    document.addEventListener('visibilitychange', beiRueckkehr);
    window.addEventListener('focus', beiRueckkehr);
    window.addEventListener('online', beiRueckkehr);

    return () => {
      aktiv = false;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', beiRueckkehr);
      window.removeEventListener('focus', beiRueckkehr);
      window.removeEventListener('online', beiRueckkehr);
    };
  }, [ready, abgleichen]);

  const recipes = useMemo(() => alleRezepte(state.customRecipes), [state.customRecipes]);
  const getRecipe = useCallback(
    (id: string) => findeRezept(id, state.customRecipes),
    [state.customRecipes],
  );
  const getIngredient = useCallback(
    (id: string) => findeZutat(id, state.customIngredients),
    [state.customIngredients],
  );
  const isCustomRecipe = useCallback(
    (recipeId: string) => state.customRecipes.some((r) => r.id === recipeId),
    [state.customRecipes],
  );

  const addCustomRecipe = useCallback(
    (entwurf: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>, neueZutaten: Ingredient[]) => {
      const jetzt = new Date().toISOString();
      const slug =
        entwurf.name
          .toLowerCase()
          .normalize('NFKD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 40) || 'rezept';
      const recipe: Recipe = {
        ...entwurf,
        id: `eigenes-${slug}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: jetzt,
        updatedAt: jetzt,
      };
      setState((prev) => {
        const vorhandeneIds = new Set(prev.customIngredients.map((i) => i.id));
        const wirklichNeu = neueZutaten.filter((i) => !vorhandeneIds.has(i.id));
        return {
          ...prev,
          customRecipes: [recipe, ...prev.customRecipes],
          customIngredients: [...prev.customIngredients, ...wirklichNeu],
        };
      });
      return recipe;
    },
    [],
  );

  const removeCustomRecipe = useCallback((recipeId: string) => {
    setState((prev) => ({
      ...prev,
      customRecipes: prev.customRecipes.filter((r) => r.id !== recipeId),
      favorites: prev.favorites.filter((f) => f.recipeId !== recipeId),
    }));
  }, []);

  const isFavorite = useCallback(
    (recipeId: string) => state.favorites.some((f) => f.recipeId === recipeId),
    [state.favorites],
  );

  const toggleFavorite = useCallback((recipeId: string) => {
    setState((prev) => {
      const exists = prev.favorites.some((f) => f.recipeId === recipeId);
      return {
        ...prev,
        favorites: exists
          ? prev.favorites.filter((f) => f.recipeId !== recipeId)
          : [
              ...prev.favorites,
              { userId: prev.user.id, recipeId, createdAt: new Date().toISOString() },
            ],
      };
    });
  }, []);

  const ratingsFor = useCallback(
    (recipeId: string) => state.ratings.filter((r) => r.recipeId === recipeId),
    [state.ratings],
  );

  const averageRating = useCallback(
    (recipeId: string) => {
      const list = state.ratings.filter((r) => r.recipeId === recipeId);
      if (list.length === 0) return { average: 0, count: 0, kidsLikedCount: 0 };
      const sum = list.reduce((acc, r) => acc + r.stars, 0);
      return {
        average: Math.round((sum / list.length) * 10) / 10,
        count: list.length,
        kidsLikedCount: list.filter((r) => r.kidsLiked === true).length,
      };
    },
    [state.ratings],
  );

  const saveRating = useCallback(
    (input: { recipeId: string; stars: number; kidsLiked: boolean | null; comment?: string }) => {
      setState((prev) => ({
        ...prev,
        ratings: [
          ...prev.ratings,
          {
            id: `rating_${Math.random().toString(36).slice(2, 10)}`,
            userId: prev.user.id,
            recipeId: input.recipeId,
            stars: input.stars,
            kidsLiked: input.kidsLiked,
            ...(input.comment ? { comment: input.comment } : {}),
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [],
  );

  const addRecipeToShoppingList = useCallback((recipe: Recipe, servings: number) => {
    setState((prev) => ({ ...prev, shoppingList: addRecipe(prev.shoppingList, recipe, servings) }));
  }, []);

  const removeRecipeFromShoppingList = useCallback((recipeId: string) => {
    setState((prev) => ({ ...prev, shoppingList: removeRecipe(prev.shoppingList, recipeId) }));
  }, []);

  const addManualItem = useCallback((ingredientId: string, amount: number, unit: Unit) => {
    setState((prev) => ({
      ...prev,
      shoppingList: addItems(prev.shoppingList, [{ ingredientId, amount, unit, manual: true }]),
    }));
  }, []);

  const toggleShoppingItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      shoppingList: {
        ...prev.shoppingList,
        items: prev.shoppingList.items.map((it) =>
          it.id === itemId ? { ...it, checked: !it.checked } : it,
        ),
      },
    }));
  }, []);

  const deleteShoppingItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      shoppingList: {
        ...prev.shoppingList,
        items: prev.shoppingList.items.filter((it) => it.id !== itemId),
      },
    }));
  }, []);

  const clearCheckedItems = useCallback(() => {
    setState((prev) => ({
      ...prev,
      shoppingList: {
        ...prev.shoppingList,
        items: prev.shoppingList.items.filter((it) => !it.checked),
      },
    }));
  }, []);

  const clearShoppingList = useCallback(() => {
    setState((prev) => ({ ...prev, shoppingList: { ...prev.shoppingList, items: [] } }));
  }, []);

  const setPlanEntry = useCallback(
    (day: Weekday, slot: MealSlot, recipeId: string, servings: number) => {
      setState((prev) => {
        const items = prev.weeklyPlan.items.filter((it) => !(it.day === day && it.slot === slot));
        items.push({
          id: `wpi_${day}_${slot}`,
          day,
          slot,
          recipeId,
          servings,
        });
        return { ...prev, weeklyPlan: { ...prev.weeklyPlan, items } };
      });
    },
    [],
  );

  const removePlanEntry = useCallback((day: Weekday, slot: MealSlot) => {
    setState((prev) => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        items: prev.weeklyPlan.items.filter((it) => !(it.day === day && it.slot === slot)),
      },
    }));
  }, []);

  const clearPlan = useCallback(() => {
    setState((prev) => ({ ...prev, weeklyPlan: { ...prev.weeklyPlan, items: [] } }));
  }, []);

  /** Uebertraegt alle Rezepte der Woche in die Einkaufsliste. Gibt die Anzahl der Rezepte zurueck. */
  const createWeekShopping = useCallback(() => {
    // Die Anzahl wird aus dem aktuellen Zustand gelesen, nicht im Updater ermittelt –
    // sonst waere der Rueckgabewert immer 0, weil React den Updater spaeter ausfuehrt.
    const count = state.weeklyPlan.items.length;
    if (count === 0) return 0;
    setState((prev) => {
      const nachschlagen = Object.fromEntries(alleRezepte(prev.customRecipes).map((r) => [r.id, r]));
      const pending = pendingItemsFromPlan(prev.weeklyPlan, nachschlagen);
      if (pending.length === 0) return prev;
      return { ...prev, shoppingList: addItems(prev.shoppingList, pending) };
    });
    return count;
  }, [state.weeklyPlan.items.length]);

  const setHousehold = useCallback((adults: number, kids: number) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        household: { adults, kids },
        defaultServings: Math.max(1, adults + kids),
      },
    }));
  }, []);

  const importState = useCallback((next: AppState) => {
    setState(next);
  }, []);

  const resetAll = useCallback(() => {
    setState(createInitialState());
  }, []);

  const anmeldenAmServer = useCallback(
    async (passwort: string) => {
      const ergebnis = await anmelden(passwort);
      if (ergebnis.ok) {
        // Nach der Anmeldung sofort abgleichen.
        serverVersion.current = null;
        ungesendet.current = true;
        void abgleichen();
      }
      return ergebnis;
    },
    [abgleichen],
  );

  const abmeldenVomServer = useCallback(() => {
    abmelden();
    setSync({ state: 'anmeldung', lastSyncAt: null });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      ready,
      sync,
      speicherFehler,
      recipes,
      getRecipe,
      getIngredient,
      addCustomRecipe,
      removeCustomRecipe,
      isCustomRecipe,
      isFavorite,
      toggleFavorite,
      ratingsFor,
      averageRating,
      saveRating,
      addRecipeToShoppingList,
      removeRecipeFromShoppingList,
      addManualItem,
      toggleShoppingItem,
      deleteShoppingItem,
      clearCheckedItems,
      clearShoppingList,
      setPlanEntry,
      removePlanEntry,
      clearPlan,
      createWeekShopping,
      setHousehold,
      importState,
      resetAll,
      anmeldenAmServer,
      abmeldenVomServer,
    }),
    [
      state,
      ready,
      sync,
      speicherFehler,
      recipes,
      getRecipe,
      getIngredient,
      addCustomRecipe,
      removeCustomRecipe,
      isCustomRecipe,
      isFavorite,
      toggleFavorite,
      ratingsFor,
      averageRating,
      saveRating,
      addRecipeToShoppingList,
      removeRecipeFromShoppingList,
      addManualItem,
      toggleShoppingItem,
      deleteShoppingItem,
      clearCheckedItems,
      clearShoppingList,
      setPlanEntry,
      removePlanEntry,
      clearPlan,
      createWeekShopping,
      setHousehold,
      importState,
      resetAll,
      anmeldenAmServer,
      abmeldenVomServer,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
