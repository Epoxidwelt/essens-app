import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalStorageRepository } from '../src/lib/storage';
import { createInitialState } from '../src/lib/storage';

/**
 * Prüft die localStorage-Anbindung – insbesondere, dass ein fehlgeschlagenes
 * Speichern gemeldet wird (`save()` -> false), statt Datenverlust zu
 * verschleiern (z. B. wenn der Speicher durch Fotos bei eigenen Rezepten voll ist).
 */

function fakeLocalStorage(): Storage {
  const daten = new Map<string, string>();
  return {
    getItem: (k: string) => daten.get(k) ?? null,
    setItem: (k: string, v: string) => {
      daten.set(k, v);
    },
    removeItem: (k: string) => {
      daten.delete(k);
    },
    clear: () => daten.clear(),
    key: (i: number) => [...daten.keys()][i] ?? null,
    get length() {
      return daten.size;
    },
  } as Storage;
}

describe('LocalStorageRepository', () => {
  let original: Storage;

  beforeEach(() => {
    original = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', { value: fakeLocalStorage(), configurable: true });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'localStorage', { value: original, configurable: true });
  });

  it('meldet erfolgreiches Speichern und liest denselben Stand zurück', async () => {
    const repo = new LocalStorageRepository();
    const state = createInitialState();
    state.customRecipes.push({
      id: 'x',
      name: 'Test',
      description: '',
      placeholder: { emoji: '📷', tone: 'green' },
      baseServings: 4,
      timeMinutes: 10,
      difficulty: 'einfach',
      ingredients: [],
      steps: [],
      nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
      categories: [],
      noAddedSugar: true,
      kidFriendly: true,
      onePot: false,
    });

    const erfolg = await repo.save(state);
    expect(erfolg).toBe(true);

    const geladen = await repo.load();
    expect(geladen?.customRecipes[0]?.name).toBe('Test');
  });

  it('meldet false, wenn der Speicher voll ist, statt den Fehler zu verschlucken', async () => {
    vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    const repo = new LocalStorageRepository();
    const erfolg = await repo.save(createInitialState());
    expect(erfolg).toBe(false);
  });

  it('load() kommt mit gesperrtem/privatem Speicher zurecht (liefert null statt zu werfen)', async () => {
    vi.spyOn(globalThis.localStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('SecurityError');
    });
    const repo = new LocalStorageRepository();
    await expect(repo.load()).resolves.toBeNull();
  });
});
