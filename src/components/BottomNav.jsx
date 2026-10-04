import { NavLink } from "react-router-dom";

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? "bottom-nav-item active" : "bottom-nav-item"
        }
      >
        <span>⌂</span>
        <small>Home</small>
      </NavLink>

      <NavLink
        to="/habits"
        className={({ isActive }) =>
          isActive ? "bottom-nav-item active" : "bottom-nav-item"
        }
      >
        <span>✓</span>
        <small>Habits</small>
      </NavLink>

      <NavLink
        to="/todos"
        className={({ isActive }) =>
          isActive ? "bottom-nav-item active" : "bottom-nav-item"
        }
      >
        <span>☑</span>
        <small>Tasks</small>
      </NavLink>

      <NavLink
        to="/statistics"
        className={({ isActive }) =>
          isActive ? "bottom-nav-item active" : "bottom-nav-item"
        }
      >
        <span>▥</span>
        <small>Stats</small>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "bottom-nav-item active" : "bottom-nav-item"
        }
      >
        <span>●</span>
        <small>Profile</small>
      </NavLink>
    </nav>
  );
}

export default BottomNav;