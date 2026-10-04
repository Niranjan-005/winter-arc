import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [habits, setHabits] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [habitsResponse, todosResponse] = await Promise.all([
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
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHistory();
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

  const getCompletedCount = (dateKey) => {
    const habitCount = habits.filter((habit) =>
      (habit.completedDates || []).includes(dateKey)
    ).length;

    const todoCount = todos.filter((todo) =>
      (todo.completedDates || []).includes(dateKey)
    ).length;

    return habitCount + todoCount;
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isToday = (date) => {
    if (!date) return false;

    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const calendarDays = getCalendarDays();

  const totalCompletedThisMonth = calendarDays.reduce(
    (total, date) => {
      if (!date) return total;

      return total + getCompletedCount(getDateKey(date));
    },
    0
  );

  return (
    <div className="app-page">
      <div className="app-container">

        <header className="top-header">
          <h1>📅 History</h1>
          <p>Look back at your consistency.</p>
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

        {loading ? (
          <section className="list-card empty-state">
            <h2>Loading History...</h2>
            <p>Please wait.</p>
          </section>
        ) : (
          <>
            <section className="list-card">

              <div className="calendar-header">
                <button
                  className="secondary-btn"
                  onClick={goToPreviousMonth}
                >
                  ←
                </button>

                <div>
                  <h2>{getMonthName()}</h2>
                  <p>
                    {totalCompletedThisMonth} completed
                    {totalCompletedThisMonth !== 1
                      ? " items"
                      : " item"}
                  </p>
                </div>

                <button
                  className="secondary-btn"
                  onClick={goToNextMonth}
                >
                  →
                </button>
              </div>

              <button
                className="secondary-btn today-btn"
                onClick={goToToday}
              >
                Today
              </button>

              <div className="calendar-grid weekdays">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              <div className="calendar-grid">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return (
                      <div
                        className="calendar-day empty-day"
                        key={`empty-${index}`}
                      />
                    );
                  }

                  const dateKey = getDateKey(date);
                  const completedCount =
                    getCompletedCount(dateKey);

                  return (
                    <div
                      className={`calendar-day ${
                        isToday(date) ? "today-day" : ""
                      } ${
                        completedCount > 0
                          ? "completed-day"
                          : ""
                      }`}
                      key={dateKey}
                    >
                      <span className="day-number">
                        {date.getDate()}
                      </span>

                      {completedCount > 0 && (
                        <span className="completion-dot">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="calendar-legend">
                <span>
                  <span className="legend-dot completed-legend">
                    ✓
                  </span>
                  Completed
                </span>

                <span>
                  <span className="legend-dot today-legend">
                    •
                  </span>
                  Today
                </span>
              </div>

            </section>

            <section className="list-card">
              <h2>📈 Monthly Summary</h2>

              <p>
                Habits completed:{" "}
                <strong>
                  {habits.reduce(
                    (count, habit) =>
                      count +
                      (habit.completedDates || []).filter(
                        (date) => {
                          const current =
                            new Date(date + "T00:00:00");

                          return (
                            current.getMonth() ===
                              currentMonth.getMonth() &&
                            current.getFullYear() ===
                              currentMonth.getFullYear()
                          );
                        }
                      ).length,
                    0
                  )}
                </strong>
              </p>

              <p>
                Tasks completed:{" "}
                <strong>
                  {todos.reduce(
                    (count, todo) =>
                      count +
                      (todo.completedDates || []).filter(
                        (date) => {
                          const current =
                            new Date(date + "T00:00:00");

                          return (
                            current.getMonth() ===
                              currentMonth.getMonth() &&
                            current.getFullYear() ===
                              currentMonth.getFullYear()
                          );
                        }
                      ).length,
                    0
                  )}
                </strong>
              </p>
            </section>
          </>
        )}

      </div>
    </div>
  );
}

export default History;