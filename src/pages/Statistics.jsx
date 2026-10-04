import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Statistics() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [habits, setHabits] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [habitsResponse, todosResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/habits", {
              headers: authHeaders,
            }),
            fetch("http://localhost:5000/api/todos", {
              headers: authHeaders,
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

        if (habitsResponse.ok) setHabits(habitsData);
        if (todosResponse.ok) setTodos(todosData);
      } catch (error) {
        console.error("Failed to load statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStatistics();
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getDateKey(new Date());

  const completedToday = habits.filter((habit) =>
    (habit.completedDates || []).includes(today)
  ).length;

  const completedTodosToday = todos.filter((todo) =>
    (todo.completedDates || []).includes(today)
  ).length;

  const totalCompletedHabitDays = habits.reduce(
    (total, habit) =>
      total + (habit.completedDates || []).length,
    0
  );

  const totalCompletedTodoDays = todos.reduce(
    (total, todo) =>
      total + (todo.completedDates || []).length,
    0
  );

  const totalCompleted =
    totalCompletedHabitDays + totalCompletedTodoDays;

  const totalToday =
    completedToday + completedTodosToday;

  const totalItems = habits.length + todos.length;

  const todayProgress =
    totalItems === 0
      ? 0
      : Math.round((totalToday / totalItems) * 100);

  const getAllCompletedDates = () => {
    return [
      ...new Set([
        ...habits.flatMap(
          (habit) => habit.completedDates || []
        ),
        ...todos.flatMap(
          (todo) => todo.completedDates || []
        ),
      ]),
    ].sort();
  };

  const calculateCurrentStreak = () => {
    const dates = getAllCompletedDates();

    let streak = 0;
    const currentDate = new Date();

    while (true) {
      const date = getDateKey(currentDate);

      if (!dates.includes(date)) {
        break;
      }

      streak++;

      currentDate.setDate(
        currentDate.getDate() - 1
      );
    }

    return streak;
  };

  const calculateBestStreak = () => {
    const dates = getAllCompletedDates();

    if (dates.length === 0) {
      return 0;
    }

    let bestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const previous = new Date(
        dates[i - 1] + "T00:00:00"
      );

      const current = new Date(
        dates[i] + "T00:00:00"
      );

      const difference =
        (current - previous) /
        (1000 * 60 * 60 * 24);

      if (difference === 1) {
        currentStreak++;

        bestStreak = Math.max(
          bestStreak,
          currentStreak
        );
      } else {
        currentStreak = 1;
      }
    }

    return bestStreak;
  };

  const getLast7Days = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setDate(date.getDate() - i);

      const dateKey = getDateKey(date);

      const completed =
        getAllCompletedDates().includes(dateKey);

      days.push({
        dateKey,
        day: date.toLocaleDateString("en-IN", {
          weekday: "short",
        }),
        date: date.getDate(),
        completed,
        count:
          habits.filter((habit) =>
            (habit.completedDates || []).includes(
              dateKey
            )
          ).length +
          todos.filter((todo) =>
            (todo.completedDates || []).includes(
              dateKey
            )
          ).length,
      });
    }

    return days;
  };

  const currentStreak = calculateCurrentStreak();
  const bestStreak = calculateBestStreak();
  const last7Days = getLast7Days();

  if (loading) {
    return (
      <div className="app-page">
        <div className="app-container">
          <section className="list-card empty-state">
            <h2>Loading Statistics...</h2>
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
          <h1>📊 Statistics</h1>
          <p>Track your progress and consistency.</p>
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

        {/* MAIN STATS */}

        <section className="dashboard-grid">

          <div className="dashboard-card">
            <h2>🎯</h2>
            <p>Total Habits</p>
            <h2>{habits.length}</h2>
          </div>

          <div className="dashboard-card">
            <h2>📝</h2>
            <p>Total Tasks</p>
            <h2>{todos.length}</h2>
          </div>

          <div className="dashboard-card">
            <h2>🔥</h2>
            <p>Current Streak</p>
            <h2>{currentStreak} days</h2>
          </div>

          <div className="dashboard-card">
            <h2>🏆</h2>
            <p>Best Streak</p>
            <h2>{bestStreak} days</h2>
          </div>

        </section>

        {/* TODAY PROGRESS */}

        <section className="list-card">

          <h2>📈 Today's Progress</h2>

          <div className="stats-progress-container">

            <div className="stats-progress-bar">
              <div
                className="stats-progress-fill"
                style={{
                  width: `${todayProgress}%`,
                }}
              />
            </div>

            <h2>{todayProgress}%</h2>

          </div>

          <p>
            {totalToday} of {totalItems} items completed today.
          </p>

        </section>

        {/* 7 DAY ACTIVITY */}

        <section className="list-card">

          <h2>📅 Last 7 Days</h2>

          <div className="weekly-chart">

            {last7Days.map((day) => (
              <div
                className="chart-day"
                key={day.dateKey}
              >

                <div className="chart-value">
                  {day.count}
                </div>

                <div
                  className={`chart-bar ${
                    day.completed
                      ? "chart-active"
                      : ""
                  }`}
                  style={{
                    height: `${Math.max(
                      day.count * 25,
                      8
                    )}px`,
                  }}
                />

                <strong>{day.day}</strong>

                <span>{day.date}</span>

              </div>
            ))}

          </div>

        </section>

        {/* SUMMARY */}

        <section className="list-card">

          <h2>📋 Overall Summary</h2>

          <div className="dashboard-item">
            Completed habit days:
            <strong>
              {" "}
              {totalCompletedHabitDays}
            </strong>
          </div>

          <div className="dashboard-item">
            Completed task days:
            <strong>
              {" "}
              {totalCompletedTodoDays}
            </strong>
          </div>

          <div className="dashboard-item">
            Total completed:
            <strong>
              {" "}
              {totalCompleted}
            </strong>
          </div>

          <div className="dashboard-item">
            Today's completed:
            <strong>
              {" "}
              {totalToday}
            </strong>
          </div>

        </section>

      </div>
    </div>
  );
}

export default Statistics;