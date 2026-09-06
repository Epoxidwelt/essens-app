import { Link, Route, Routes } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Recipes } from './pages/Recipes';
import { RecipeDetail } from './pages/RecipeDetail';
import { Favorites } from './pages/Favorites';
import { ShoppingList } from './pages/ShoppingList';
import { WeekPlan } from './pages/WeekPlan';
import { Settings } from './pages/Settings';
import { AddRecipe } from './pages/AddRecipe';
import { useApp } from './store/AppContext';

export function App() {
  const { ready, speicherFehler } = useApp();

  return (
    <div className="app">
      {speicherFehler && (
        <div
          className="card"
          role="alert"
          style={{
            margin: '10px 16px 0',
            background: 'var(--accent-soft)',
            borderColor: 'transparent',
          }}
        >
          <strong>⚠️ Speichern fehlgeschlagen</strong>
          <p style={{ marginTop: 6, fontSize: 14 }}>
            Die letzte Änderung konnte nicht dauerhaft gespeichert werden – der Speicher dieses
            Geräts ist vermutlich voll (oft durch Fotos bei eigenen Rezepten). Solange diese
            Meldung steht, gehen neue Änderungen beim Schließen der App verloren.
          </p>
          <Link to="/einstellungen" className="btn btn-sm" style={{ marginTop: 10 }}>
            Zu den Einstellungen (Sicherung erstellen)
          </Link>
        </div>
      )}
      {ready ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rezepte" element={<Recipes />} />
          <Route path="/rezept/:id" element={<RecipeDetail />} />
          <Route path="/rezept-hinzufuegen" element={<AddRecipe />} />
          <Route path="/lecker" element={<Favorites />} />
          <Route path="/einkaufsliste" element={<ShoppingList />} />
          <Route path="/wochenplan" element={<WeekPlan />} />
          <Route path="/einstellungen" element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Routes>
      ) : (
        <div className="empty-state">
          <div className="big" aria-hidden>🍲</div>
          <p>Lade …</p>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
