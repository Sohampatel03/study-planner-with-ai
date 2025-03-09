import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    duration: "",
    date: "", // Add date field
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/ai-suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      const aiSuggestedTask = await response.json();

      // Navigate with both original and AI-suggested task
      navigate("/ai-suggested-task", { state: { originalTask: task, aiTask: aiSuggestedTask } });
    } else {
      alert("Error getting AI suggestions.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 mt-11 shadow-lg rounded-lg text-black">
      <h2 className="text-xl font-semibold text-center text-white mb-4">Add New Task</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter Task Name"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1">Description(optional)</label>
          <textarea
            value={task.description}
            placeholder="Enter Description Related to Task"
            defaultValue={task.title}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full p-2 border rounded-md h-24"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1">Duration (mins)</label>
          <input
            type="number"
            value={task.duration}
            placeholder="Enter Time in Minutes"
            onChange={(e) => setTask({ ...task, duration: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-1">Task Date</label>
          <input
            type="date"
            value={task.date}
            onChange={(e) => setTask({ ...task, date: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 rounded-md">
          Get AI Suggestion
        </button>
      </form>
    </div>
  );
}

export default AddTask;
