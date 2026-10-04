import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [habits, setHabits] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [habitsResponse, todosResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/habits", {
              headers,
            }),
            fetch("http://localhost:5000/api/todos", {
              headers,
            }),
          ]);

        if (
          habitsResponse.status === 401 ||
          todosResponse.status === 401
        ) {
          localStorage.clear();
          navigate("/");
          return;
        }

        const habitsData = await habitsResponse.json();
        const todosData = await todosResponse.json();

        if (habitsResponse.ok) {
          setHabits(habitsData);
        }

        if (todosResponse.ok) {
          setTodos(todosData);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  const completedHabits = habits.filter((habit) =>
    (habit.completedDates || []).includes(today)
  ).length;

  const completedTodos = todos.filter((todo) =>
    (todo.completedDates || []).includes(today)
  ).length;

  const totalItems = habits.length + todos.length;
  const completedItems = completedHabits + completedTodos;

  const progress =
    totalItems === 0
      ? 0
      : Math.round((completedItems / totalItems) * 100);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="app-page">
        <div className="app-container">
          <section className="list-card empty-state">
            <h2>Loading Dashboard...</h2>
            <p>Please wait.</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="app-container">

        <header className="top-header">
          <div>
            <h1>❄️ Winter Arc</h1>

            <p>
              Welcome, {user?.name || "User"} 👋
            </p>

            {user?.email && (
              <small>{user.email}</small>
            )}

            <p>Stay consistent. Build yourself.</p>
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>
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

        <section className="progress-card">
          <p>Today's Progress</p>

          <h2>{progress}%</h2>

          <p>
            {completedItems} / {totalItems} completed
          </p>
        </section>

        <div className="dashboard-grid">

          <section className="dashboard-card">
            <h2>🎯 Today's Habits</h2>

            {habits.length === 0 ? (
              <p>No habits added yet.</p>
            ) : (
              habits.map((habit) => {
                const completed =
                  (habit.completedDates || []).includes(today);

                return (
                  <div
                    className="dashboard-item"
                    key={habit._id}
                  >
                    {completed ? "✅" : "⬜"}{" "}
                    {habit.name}
                  </div>
                );
              })
            )}

            <Link
              className="card-link"
              to="/habits"
            >
              Manage Habits →
            </Link>
          </section>

          <section className="dashboard-card">
            <h2>📝 Today's Tasks</h2>

            {todos.length === 0 ? (
              <p>No tasks added yet.</p>
            ) : (
              todos.map((todo) => {
                const completed =
                  (todo.completedDates || []).includes(today);

                return (
                  <div
                    className="dashboard-item"
                    key={todo._id}
                  >
                    {completed ? "✅" : "⬜"}{" "}
                    {todo.name}
                  </div>
                );
              })
            )}

            <Link
              className="card-link"
              to="/todos"
            >
              Manage Tasks →
            </Link>
          </section>

        </div>

        <section className="dashboard-card">
          <h2>👤 Profile</h2>

          <div className="dashboard-item">
            <strong>Name:</strong>{" "}
            {user?.name || "Not available"}
          </div>

          <div className="dashboard-item">
            <strong>Email:</strong>{" "}
            {user?.email || "Not available"}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Dashboard;