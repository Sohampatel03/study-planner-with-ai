import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function AiSuggestedTask() {
  const location = useLocation();
  const navigate = useNavigate();
  const [task, setTask] = useState(location.state || {});

  const handleSave = async () => {
    const response = await fetch("http://localhost:5000/save-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      alert("Task saved successfully!");
      navigate("/"); // Redirect to home page or task list page
    } else {
      alert("Error saving task.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white mt-11 shadow-lg rounded-lg text-black">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">AI-Suggested Task</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Improved Description</label>
        <textarea
          value={task.improvedDescription}
          onChange={(e) => setTask({ ...task, improvedDescription: e.target.value })}
          className="w-full p-2 border rounded-md h-24"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Suggested Duration (mins)</label>
        <input
          type="number"
          value={task.suggestedDuration}
          onChange={(e) => setTask({ ...task, suggestedDuration: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <button 
        onClick={handleSave} 
        className="w-full bg-green-500 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
      >
        Confirm & Add Task
      </button>
    </div>
  );
}

export default AiSuggestedTask;
