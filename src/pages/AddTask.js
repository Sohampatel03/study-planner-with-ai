import { useState } from "react";

function AddTask() {
  const [task, setTask] = useState({ title: "", description: "", date: "", duration: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      alert("Task added successfully!");
    } else {
      alert("Error adding task.");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-lg mx-auto p-6 bg-white mt-11 shadow-lg rounded-lg text-black"
    >
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Add New Task</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Title</label>
        <input
          type="text"
          placeholder="Enter task title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Description</label>
        <textarea
          placeholder="Enter task description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-24"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={task.date}
          onChange={(e) => setTask({ ...task, date: e.target.value })}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Duration (mins)</label>
        <input
          type="number"
          placeholder="Enter duration in minutes"
          value={task.duration}
          onChange={(e) => setTask({ ...task, duration: e.target.value })}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300"
      >
        Add Task
      </button>
    </form>
  );
}

export default AddTask;
