import { useEffect, useState } from "react";
import "../styles/globals.css";

// Define Task type for type safety
type Task = {
  id: number;       // unique identifier for each task
  title: string;    // task description/title
  completed: boolean; // whether the task is completed or not
};

// Tasks component handles displaying, adding, and deleting tasks
export default function Tasks() {
  // Local state
  const [tasks, setTasks] = useState<Task[]>([]); // list of tasks
  const [loading, setLoading] = useState(true);   // loading state for data fetch
  const [newTask, setNewTask] = useState("");     // input value for new task

  // Fetch tasks from backend API
  const fetchTasks = async () => {
    setLoading(true); // show loading state
    const res = await fetch("/api/tasks"); // GET request to tasks API
    const data = await res.json();         // parse JSON response
    setTasks(data);                        // update tasks state
    setLoading(false);                     // hide loading state
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return; // prevent empty task submission
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }), // send new task to backend
    });
    setNewTask(""); // clear input field
    fetchTasks();   // refresh task list
  };

  // Delete a task by ID
  const handleDeleteTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE", // send delete request to backend
    });
    fetchTasks(); // refresh task list
  };

  // Show loading state while fetching tasks
  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="tasks-container">
      <div className="card">
        <h1>My Tasks</h1>

        {/* Add task input and button */}
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
          />
          <button onClick={handleAddTask}>Add</button>
        </div>

        {/* Task list */}
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id}>
              {/* Show task title and completion status */}
              <span>
                {task.title} {task.completed ? "✅" : "❌"}
              </span>

              {/* Delete button */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="delete"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
