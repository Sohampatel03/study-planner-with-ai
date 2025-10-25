import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state
  const [task, setTask] = useState({
    title: "",
    description: "",
    duration: "",
    date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const totalMinutes = parseInt(task.hours || 0) * 60 + parseInt(task.minutes || 0);
    const formattedTask = {
      title: task.title,
      description: task.description,
      duration: totalMinutes,
      date: task.date,
    };

    console.log("Task Data:", formattedTask);

    try {
      const response = await fetch("http://localhost:5000/ai-suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formattedTask),
      });

      if (response.ok) {
        const aiSuggestedTask = await response.json();
        navigate("/ai-suggested-task", {
          state: { originalTask: formattedTask, aiTask: aiSuggestedTask },
        });
      } else {
        alert("Error fetching AI suggestions.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch AI suggestion.");
    } finally {
      setLoading(false); // Stop loading
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
          <label className="block text-white mb-1">Description (optional)</label>
          <textarea
            value={task.description}
            placeholder="Enter Description Related to Task"
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full p-2 border rounded-md h-24"
            required
          />
        </div>

        {/* Hours & Minutes Fields */}
        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <label className="block text-white mb-1">Hours</label>
            <input
              type="number"
              min="0"
              max="23"
              value={task.hours}
              placeholder="HH"
              onChange={(e) => setTask({ ...task, hours: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-white mb-1">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={task.minutes}
              placeholder="MM"
              onChange={(e) => setTask({ ...task, minutes: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
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

        {/* Submit Button with Loading Spinner */}
        <button
          type="submit"
          className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Fetching AI Suggestion...
            </>
          ) : (
            "Get AI Suggestion"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddTask;
