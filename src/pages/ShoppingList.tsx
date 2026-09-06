import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { INGREDIENTS, SHOP_CATEGORY_LABEL } from '../data/ingredients';
import { groupByCategory, itemAmount, shoppingListToText } from '../lib/shopping';
import { formatQuantity } from '../lib/quantity';
import { useApp } from '../store/AppContext';
import { Sheet } from '../components/Sheet';
import { useToast } from '../components/Toast';
import type { Unit } from '../types';

const UNITS: Unit[] = ['Stk', 'g', 'ml', 'Packung', 'Bund', 'Dose'];

export function ShoppingList() {
  const {
    state,
    getRecipe,
    getIngredient,
    toggleShoppingItem,
    deleteShoppingItem,
    clearCheckedItems,
    clearShoppingList,
    addManualItem,
  } = useApp();
  const { showToast, toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState<Unit>('Stk');
  const [picked, setPicked] = useState<string | null>(null);
  const [hidePantry, setHidePantry] = useState(false);
  const [shareText, setShareText] = useState<string | null>(null);

  /**
   * Liste teilen.
   * Teilen-Dialog und Zwischenablage gibt es nur bei sicherer Verbindung
   * (https oder localhost). Am Handy im Heimnetz laeuft die App per http –
   * dort zeigen wir den Text zum Markieren an, damit Teilen immer moeglich ist.
   */
  async function shareList() {
    const text = shoppingListToText(items, state.customIngredients);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Einkaufsliste', text });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        showToast('📋 Liste kopiert');
        return;
      }
    } catch (e) {
      // Abbruch durch den Nutzer ist kein Fehler – dann nichts weiter tun.
      if (e instanceof DOMException && e.name === 'AbortError') return;
    }
    setShareText(text);
  }

  // Vorratszutaten (Salz, Öl, Gewürze) lassen sich ausblenden – man hat sie meist zu Hause.
  const items = useMemo(
    () =>
      hidePantry
        ? state.shoppingList.items.filter((i) => !getIngredient(i.ingredientId)?.pantry)
        : state.shoppingList.items,
    [state.shoppingList.items, hidePantry],
  );
  const pantryCount = state.shoppingList.items.length - items.length;
  const groups = useMemo(() => groupByCategory(items, state.customIngredients), [items, state.customIngredients]);
  const open = items.filter((i) => !i.checked).length;
  const done = items.length - open;
  const hiddenPantryCount = hidePantry
    ? pantryCount
    : state.shoppingList.items.filter((i) => getIngredient(i.ingredientId)?.pantry).length;

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return INGREDIENTS.slice(0, 12);
    return INGREDIENTS.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 12);
  }, [search]);

  /** Rezeptnamen, aus denen eine Position stammt. */
  function sourceLabel(recipeIds: string[]): string {
    const names = [...new Set(recipeIds)]
      .map((id) => getRecipe(id)?.name)
      .filter(Boolean) as string[];
    if (names.length === 0) return 'manuell hinzugefügt';
    if (names.length <= 2) return names.join(' · ');
    return `${names[0]} + ${names.length - 1} weitere`;
  }

  return (
    <>
      <div className="page-header">
        <h1>🛒 Einkaufsliste</h1>
        <span className="spacer" />
        <span className="sub">{open} offen</span>
      </div>

      <div className="page" style={{ paddingTop: 4 }}>
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="big" aria-hidden>🛒</div>
            <h2>Die Liste ist leer</h2>
            <p>Öffne ein Rezept und tippe auf „Zur Einkaufsliste“ – gleiche Zutaten werden automatisch zusammengerechnet.</p>
            <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
              <Link to="/rezepte" className="btn btn-primary">Rezepte ansehen</Link>
              <button type="button" className="btn" onClick={() => setShowAdd(true)}>+ Eigenes</button>
            </div>
          </div>
        ) : (
          <>
            <div className="row" style={{ gap: 8 }}>
              <button type="button" className="btn btn-sm" onClick={() => setShowAdd(true)}>
                + Position
              </button>
              <button type="button" className="btn btn-sm" onClick={() => void shareList()}>
                📤 Teilen
              </button>
              {done > 0 && (
                <button type="button" className="btn btn-sm" onClick={clearCheckedItems}>
                  Erledigte löschen ({done})
                </button>
              )}
              <span className="spacer" />
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  clearShoppingList();
                  showToast('Liste geleert');
                }}
              >
                Alles löschen
              </button>
            </div>

            {hiddenPantryCount > 0 && (
              <button
                type="button"
                className="chip"
                aria-pressed={hidePantry}
                style={{ marginTop: 10 }}
                onClick={() => setHidePantry((v) => !v)}
              >
                🧂 Vorrat ausblenden ({hiddenPantryCount})
              </button>
            )}

            {groups.map((group) => (
              <div className="shop-group" key={group.category}>
                <h3>{SHOP_CATEGORY_LABEL[group.category]}</h3>
                {group.items.map((item) => {
                  const q = itemAmount(item);
                  const ingredient = getIngredient(item.ingredientId);
                  return (
                    <div
                      key={item.id}
                      className={`shop-item${item.checked ? ' checked' : ''}`}
                    >
                      <button
                        type="button"
                        className="check"
                        aria-label={item.checked ? 'Wieder öffnen' : 'Abhaken'}
                        aria-pressed={item.checked}
                        onClick={() => toggleShoppingItem(item.id)}
                      >
                        {item.checked ? '✓' : ''}
                      </button>
                      <span className="text" onClick={() => toggleShoppingItem(item.id)}>
                        <span className="amount">{formatQuantity(q.amount, q.unit)}</span>{' '}
                        {ingredient?.name ?? item.ingredientId}
                        <span className="src" style={{ display: 'block' }}>
                          {sourceLabel(item.sources.map((s) => s.recipeId))}
                        </span>
                      </span>
                      <button
                        type="button"
                        className="del"
                        aria-label="Position entfernen"
                        onClick={() => deleteShoppingItem(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="card" style={{ marginTop: 22, background: 'var(--surface-soft)', borderStyle: 'dashed' }}>
              <h3>📦 Einkauf bestellen</h3>
              <p className="hint" style={{ marginTop: 6 }}>
                In Vorbereitung: Die Liste kann später direkt an einen Lieferdienst übergeben
                werden. Datenmodell und Mengen sind dafür bereits vorbereitet.
              </p>
              <button type="button" className="btn btn-block" style={{ marginTop: 12 }} disabled>
                Bald verfügbar
              </button>
            </div>
          </>
        )}
      </div>

      {shareText !== null && (
        <Sheet title="Einkaufsliste teilen" onClose={() => setShareText(null)}>
          <p className="hint">
            Text antippen, alles markieren und in WhatsApp oder eine Nachricht einfügen.
          </p>
          <textarea
            className="textarea"
            style={{ marginTop: 12, minHeight: 260, fontSize: 14 }}
            readOnly
            value={shareText}
            onFocus={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ marginTop: 12 }}
            onClick={() => setShareText(null)}
          >
            Fertig
          </button>
        </Sheet>
      )}

      {showAdd && (
        <Sheet title="Position hinzufügen" onClose={() => setShowAdd(false)}>
          <div className="search">
            <span aria-hidden>🔍</span>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zutat suchen …"
            />
          </div>
          <div className="chips" style={{ marginTop: 12 }}>
            {searchResults.map((ing) => (
              <button
                key={ing.id}
                type="button"
                className="chip"
                aria-pressed={picked === ing.id}
                onClick={() => setPicked(ing.id)}
              >
                {ing.name}
              </button>
            ))}
          </div>

          <div className="row" style={{ marginTop: 16 }}>
            <input
              className="search"
              style={{ width: 110 }}
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label="Menge"
            />
            <select
              className="search"
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              aria-label="Einheit"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ marginTop: 16 }}
            disabled={!picked || !Number(amount.replace(',', '.'))}
            onClick={() => {
              if (!picked) return;
              addManualItem(picked, Number(amount.replace(',', '.')), unit);
              setShowAdd(false);
              setPicked(null);
              setSearch('');
              setAmount('1');
              showToast('Zur Liste hinzugefügt');
            }}
          >
            Hinzufügen
          </button>
        </Sheet>
      )}

      {toast}
    </>
  );
}
