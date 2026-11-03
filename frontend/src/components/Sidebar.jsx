
import {
  Clapperboard,
  Home,
  Compass,
  Film,
  Flame,
  CalendarDays,
  Bookmark,
  Sparkles,
  ChevronLeft
} from "lucide-react";

const navigation = [
  { label: "Home", icon: Home },
  { label: "Explore Movies", icon: Compass },
  { label: "Hollywood", icon: Film },
  { label: "Bollywood", icon: Clapperboard },
  { label: "Kollywood", icon: Film },
  { label: "Trending", icon: Flame },
  { label: "Now Playing", icon: CalendarDays },
  { label: "My Watchlist", icon: Bookmark }
];

function Sidebar({ activeItem = "Home", onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Clapperboard size={32} />
        </div>
        <h2>CINE<span>MATE</span></h2>
        <p>Discover. Recommend. Enjoy.</p>
      </div>

      <nav className="sidebar-navigation">
        <span className="sidebar-label">MENU</span>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`sidebar-link ${
                activeItem === item.label ? "active" : ""
              }`}
              onClick={() => onNavigate?.(item.label)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-ai-card">
        <Sparkles size={20} />
        <h4>Powered by AI</h4>
        <p>Discover movies that match your taste.</p>
      </div>

      <div className="sidebar-footer">
        <p>© 2026 Cinemate</p>
        <span>Made for movie lovers.</span>
      </div>
    </aside>
  );
}

export default Sidebar;
