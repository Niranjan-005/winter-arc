import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Habits() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const token = localStorage.getItem("token");

  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/habits",
          {
            headers: authHeaders,
          }
        );

        if (response.status === 401) {
          localStorage.clear();
          navigate("/");
          return;
        }

        const data = await response.json();

        if (response.ok) {
          setHabits(data);
        }
      } catch (error) {
        console.error("Failed to load habits:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHabits();
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  const addHabit = async () => {
    if (!habitName.trim()) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/habits",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: habitName.trim(),
          }),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        navigate("/");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setHabits((prev) => [data, ...prev]);
        setHabitName("");
      }
    } catch (error) {
      console.error("Failed to add habit:", error);
    }
  };

  const toggleHabit = async (habit) => {
    const completedDates = habit.completedDates || [];
    const alreadyCompleted = completedDates.includes(today);

    const updatedDates = alreadyCompleted
      ? completedDates.filter((date) => date !== today)
      : [...completedDates, today];

    try {
      const response = await fetch(
        `http://localhost:5000/api/habits/${habit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completedDates: updatedDates,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        navigate("/");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setHabits((prev) =>
          prev.map((item) =>
            item._id === habit._id ? data : item
          )
        );
      }
    } catch (error) {
      console.error("Failed to update habit:", error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/habits/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        navigate("/");
        return;
      }

      if (response.ok) {
        setHabits((prev) =>
          prev.filter((habit) => habit._id !== id)
        );
      }
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  const startEdit = (habit) => {
    setEditingId(habit._id);
    setEditName(habit.name);
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/habits/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName.trim(),
          }),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        navigate("/");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setHabits((prev) =>
          prev.map((habit) =>
            habit._id === id ? data : habit
          )
        );

        setEditingId(null);
        setEditName("");
      }
    } catch (error) {
      console.error("Failed to edit habit:", error);
    }
  };

  return (
    <div className="app-page">
      <div className="app-container">

        <header className="top-header">
          <h1>🎯 My Habits</h1>
          <p>Small actions. Big changes.</p>
        </header>

        <nav className="main-nav">
          <NavLink to="/dashboard" className={({ isActive }) =>
            isActive ? "active-nav" : ""
          }>Dashboard</NavLink>

          <NavLink to="/habits" className={({ isActive }) =>
            isActive ? "active-nav" : ""
          }>Habits</NavLink>

          <NavLink to="/todos" className={({ isActive }) =>
            isActive ? "active-nav" : ""
          }>To-Do</NavLink>

          <NavLink to="/history" className={({ isActive }) =>
            isActive ? "active-nav" : ""
          }>History</NavLink>

          <NavLink to="/statistics" className={({ isActive }) =>
            isActive ? "active-nav" : ""
          }>Statistics</NavLink>

          <NavLink to="/profile" className={({ isActive }) =>
            isActive ? "active-nav" : ""
          }>Profile</NavLink>
        </nav>

        <hr />

        <section className="input-card">
          <h2>Add a Habit</h2>

          <div className="input-row">
            <input
              type="text"
              placeholder="Example: Workout"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addHabit();
              }}
            />

            <button onClick={addHabit}>
              + Add Habit
            </button>
          </div>
        </section>

        <section className="list-card">
          <h2>Today's Habits</h2>

          {loading ? (
            <div className="empty-state">
              <p>Loading habits...</p>
            </div>
          ) : habits.length === 0 ? (
            <div className="empty-state">
              <p>No habits added yet.</p>
              <small>
                Add your first habit to start your Winter Arc.
              </small>
            </div>
          ) : (
            habits.map((habit) => {
              const completed =
                (habit.completedDates || []).includes(today);

              return (
                <div
                  className={`habit-item ${
                    completed ? "completed-item" : ""
                  }`}
                  key={habit._id}
                >
                  <div className="habit-main">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={() => toggleHabit(habit)}
                    />

                    {editingId === habit._id ? (
                      <input
                        className="edit-input"
                        type="text"
                        value={editName}
                        onChange={(e) =>
                          setEditName(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(habit._id);
                          }
                        }}
                      />
                    ) : (
                      <span>{habit.name}</span>
                    )}
                  </div>

                  <div className="habit-actions">
                    {editingId === habit._id ? (
                      <button
                        onClick={() => saveEdit(habit._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(habit)}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => deleteHabit(habit._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>

      </div>
    </div>
  );
}

export default Habits;