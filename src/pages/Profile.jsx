import { NavLink, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const getInitial = () => {
    if (!user?.name) return "?";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="app-page">
      <div className="app-container">

        <header className="top-header">
          <h1>👤 Profile</h1>
          <p>Manage your Winter Arc account.</p>
        </header>

        <nav className="main-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "active-nav" : ""
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/habits"
            className={({ isActive }) =>
              isActive ? "active-nav" : ""
            }
          >
            Habits
          </NavLink>

          <NavLink
            to="/todos"
            className={({ isActive }) =>
              isActive ? "active-nav" : ""
            }
          >
            To-Do
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? "active-nav" : ""
            }
          >
            History
          </NavLink>

          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              isActive ? "active-nav" : ""
            }
          >
            Statistics
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "active-nav" : ""
            }
          >
            Profile
          </NavLink>
        </nav>

        <hr />

        {/* PROFILE HEADER */}

        <section className="profile-header-card">

          <div className="profile-avatar">
            {getInitial()}
          </div>

          <div>
            <h2>
              {user?.name || "User"}
            </h2>

            <p>
              {user?.email || "Email not available"}
            </p>

            <span className="profile-status">
              ● Account Active
            </span>
          </div>

        </section>

        {/* ACCOUNT DETAILS */}

        <section className="dashboard-card">

          <h2>👤 Account Details</h2>

          <div className="dashboard-item">
            <strong>Name</strong>
            <span>
              {user?.name || "Not available"}
            </span>
          </div>

          <div className="dashboard-item">
            <strong>Email</strong>
            <span>
              {user?.email || "Not available"}
            </span>
          </div>

          <div className="dashboard-item">
            <strong>Account Status</strong>
            <span>Active ✅</span>
          </div>

        </section>

        {/* APP SETTINGS */}

        <section className="dashboard-card">

          <h2>⚙️ App Settings</h2>

          <div className="dashboard-item">
            <div>
              <strong>Winter Arc Mode</strong>
              <p>
                Stay consistent and keep building yourself.
              </p>
            </div>

            <span>❄️ Active</span>
          </div>

          <div className="dashboard-item">
            <div>
              <strong>Data Storage</strong>
              <p>
                Your habits and tasks are connected to your account.
              </p>
            </div>

            <span>☁️ Cloud</span>
          </div>

        </section>

        {/* LOGOUT */}

        <section className="dashboard-card">

          <h2>🚪 Session</h2>

          <p>
            Logout from your Winter Arc account on this device.
          </p>

          <button
            className="primary-btn logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </section>

      </div>
    </div>
  );
}

export default Profile;