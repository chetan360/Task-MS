import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  // Initialize tasks from localStorage, fall back to an empty array if nothing is found
  const [todo, setTodo] = useState(() => {
    const storedTasks = localStorage.getItem("todos");
    if (storedTasks) {
      console.log("Loaded tasks from localStorage:", JSON.parse(storedTasks)); // Debug log
      return JSON.parse(storedTasks);
    }
    return [];
  });

  // State for adding new tasks
  const [newTodo, setNewTodo] = useState({
    task: "",
    priority: "",
    id: uuidv4(),
    isDone: false,
    createdAt: new Date().toISOString(),
  });

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  // Sort criteria states
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Add new task
  const addNewTask = (event) => {
    event.preventDefault();
    if (!newTodo.task || !newTodo.priority) return;

    const newTask = {
      task: newTodo.task,
      priority: newTodo.priority,
      id: uuidv4(),
      isDone: false,
      createdAt: new Date().toISOString(),
    };

    setTodo((prevTodo) => {
      const updatedTodos = [...prevTodo, newTask];
      localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Save to localStorage
      return updatedTodos;
    });

    setNewTodo({
      task: "",
      priority: "",
      id: uuidv4(),
      isDone: false,
      createdAt: new Date().toISOString(),
    });
  };

  // Update task input values
  const updateTodoValue = (event) => {
    const { name, value } = event.target;
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
  };

  // Toggle task's "isDone" state
  const markAsDone = (id) => {
    setTodo((prevTodo) => {
      const updatedTodos = prevTodo.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            isDone: !task.isDone, // Create a new object with the updated isDone state
          };
        }
        return task;
      });
      localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Save updated tasks to localStorage
      return updatedTodos;
    });
  };

  // Delete task
  const deleteTodo = (id) => {
    setTodo((prevTodo) => {
      const updatedTodos = prevTodo.filter((task) => task.id !== id);
      localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Save updated tasks to localStorage
      return updatedTodos;
    });
  };

  // Filtering tasks based on search query
  const filteredTasks = todo.filter((task) =>
    task.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting tasks based on selected criteria
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "priority") {
      const priorityOrder = ["low", "medium", "high"];
      const priorityA = priorityOrder.indexOf(a.priority.toLowerCase());
      const priorityB = priorityOrder.indexOf(b.priority.toLowerCase());
      return sortOrder === "asc"
        ? priorityA - priorityB
        : priorityB - priorityA;
    }
    return 0;
  });

  // Save tasks to localStorage whenever the todo list changes
  useEffect(() => {
    console.log("Saving tasks to localStorage:", todo); // Debug log
    localStorage.setItem("todos", JSON.stringify(todo)); // Persist tasks in localStorage
  }, [todo]);

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="grid place-items-center sm:mt-10 sm:mb-10">
        <form onSubmit={addNewTask}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Task Management System
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-10">
                <div className="sm:col-span-6">
                  <label
                    htmlFor="add-todo"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Add Task
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="task"
                      id="add-todo"
                      value={newTodo.task}
                      onChange={updateTodoValue}
                      autoComplete="given-name"
                      className="mt-2 p-2 border rounded-md w-full"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="priority"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Assign Priority
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="priority"
                      id="priority"
                      value={newTodo.priority}
                      onChange={updateTodoValue}
                      placeholder="low/medium/high"
                      autoComplete="postal-code"
                      className="mt-2 p-2 border rounded-md w-full"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="mt-10 rounded-md bg-indigo-500 px-3 py-2 text-md font-semibold text-white shadow-sm  hover:shadow-lg hover:shadow-indigo-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-900">
          Search Tasks
        </label>
        <input
          type="text"
          className="mt-2 p-2 border rounded-md w-full"
          placeholder="Search by task name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Sorting Section */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-900">
          Sort Tasks
        </label>

        <div className="flex gap-x-6 mt-3">
          <div>
            <label htmlFor="sortByPriority" className="mr-2">
              Sort by
            </label>
            <select
              id="sortByPriority"
              className="p-2 border rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">By Date</option>
              <option value="priority">By Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortOrder" className="mr-2">
              Sort Order
            </label>
            <select
              id="sortOrder"
              className="p-2 border rounded-md"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <ul role="list" className="divide-y divide-gray-100 mt-5 mb-5">
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            className="p-5 mt-5 mb-5 rounded-lg shadow-lg flex justify-between gap-x-6 py-5"
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p
                  className={`text-sm/6 font-semibold text-gray-900 ${
                    task.isDone ? "line-through text-gray-500" : ""
                  } transition-all duration-300`}
                >
                  {task.task}
                </p>
                <p className="capitalize mt-1 truncate text-xs/5 text-gray-500">
                  {task.priority}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="hidden shrink-0 sm:flex sm:items-end">
              <button
                type="button"
                onClick={() => markAsDone(task.id)}
                className="mr-5 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:shadow-green-500/50"
              >
                {!task.isDone ? "Mark as Done" : "Mark as Undone"}
              </button>
              <button
                type="button"
                onClick={() => deleteTodo(task.id)}
                className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:shadow-red-500/50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
