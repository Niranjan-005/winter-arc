import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Todos() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const token = localStorage.getItem("token");

  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/todos",
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
          setTodos(data);
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTodos();
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  const addTodo = async () => {
    if (!task.trim()) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: task.trim(),
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
        setTodos((prev) => [data, ...prev]);
        setTask("");
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleTodo = async (todo) => {
    const completedDates = todo.completedDates || [];
    const alreadyCompleted = completedDates.includes(today);

    const updatedDates = alreadyCompleted
      ? completedDates.filter((date) => date !== today)
      : [...completedDates, today];

    try {
      const response = await fetch(
        `http://localhost:5000/api/todos/${todo._id}`,
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
        setTodos((prev) =>
          prev.map((item) =>
            item._id === todo._id ? data : item
          )
        );
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/todos/${id}`,
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
        setTodos((prev) =>
          prev.filter((todo) => todo._id !== id)
        );
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTask(todo.name);
  };

  const saveEdit = async (id) => {
    if (!editTask.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editTask.trim(),
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
        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === id ? data : todo
          )
        );

        setEditingId(null);
        setEditTask("");
      }
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  return (
    <div className="app-page">
      <div className="app-container">

        <header className="top-header">
          <h1>📝 My To-Do List</h1>
          <p>Plan your day. Get things done.</p>
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
          <h2>Add Task</h2>

          <div className="input-row">
            <input
              type="text"
              placeholder="Example: Complete assignment"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
            />

            <button onClick={addTodo}>
              + Add Task
            </button>
          </div>
        </section>

        <section className="list-card">
          <h2>Today's Tasks</h2>

          {loading ? (
            <div className="empty-state">
              <p>Loading tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks added yet.</p>
              <small>Add your first task for today.</small>
            </div>
          ) : (
            todos.map((todo) => {
              const completed =
                (todo.completedDates || []).includes(today);

              return (
                <div
                  className={`habit-item ${
                    completed ? "completed-item" : ""
                  }`}
                  key={todo._id}
                >
                  <div className="habit-main">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={() => toggleTodo(todo)}
                    />

                    {editingId === todo._id ? (
                      <input
                        className="edit-input"
                        type="text"
                        value={editTask}
                        onChange={(e) =>
                          setEditTask(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(todo._id);
                          }
                        }}
                      />
                    ) : (
                      <span>{todo.name}</span>
                    )}
                  </div>

                  <div className="habit-actions">
                    {editingId === todo._id ? (
                      <button
                        onClick={() => saveEdit(todo._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(todo)}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => deleteTodo(todo._id)}
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

export default Todos;