import { NavLink } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const ITEMS = [
  { to: '/', icon: '🏠', label: 'Start' },
  { to: '/rezepte', icon: '🍽️', label: 'Rezepte' },
  { to: '/lecker', icon: '❤️', label: 'Lecker' },
  { to: '/einkaufsliste', icon: '🛒', label: 'Einkauf' },
  { to: '/wochenplan', icon: '📅', label: 'Woche' },
];

export function BottomNav() {
  const { state } = useApp();
  const openItems = state.shoppingList.items.filter((i) => !i.checked).length;

  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="ico" aria-hidden>
            {item.icon}
          </span>
          {item.to === '/einkaufsliste' && openItems > 0 && (
            <span className="nav-badge">{openItems}</span>
          )}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
