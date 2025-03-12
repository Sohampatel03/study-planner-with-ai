import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function AiSuggestedTask() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract AI-suggested task and original user input
  const { originalTask, aiTask } = location.state || { originalTask: {}, aiTask: {} };
  console.log({originalTask},"taskoriginal");
  const [task, setTask] = useState(aiTask || {});

  // Function to handle Accept (Save AI suggestion)
  const handleAccept = async () => {
    // Keep the original title and duration, update only the description
    const updatedTask = {
      ...originalTask, // Keep title and duration the same
      description: aiTask.improvedDescription, // Update only the description
    };
  
    console.log("Updated Task Data before sending:", updatedTask);
  
    const response = await fetch("http://localhost:5000/save-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask), // Send only updated description
    });
  
    if (response.ok) {
      alert("Task saved with AI-enhanced description!");
      navigate("/"); // Redirect to home page
    } else {
      alert("Error saving task.in frontend");
    }
  };
  // Function to handle Reject (Save original user input)
  const handleReject = async () => {
    const response = await fetch("http://localhost:5000/save-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(originalTask), // Save original task
    });

    if (response.ok) {
      alert("Original task saved successfully!");
      navigate("/"); // Redirect to home page
    } else {
      alert("Error saving task.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 mt-11 shadow-lg rounded-lg text-white">
      <h2 className="text-xl font-semibold text-center text-white-800 mb-4">AI-Suggested Task</h2>

      <div className="mb-4">
        <label className="block text-white-700 mb-1">Title</label>
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="w-full p-2 border rounded-md text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white-700 mb-1">Improved Description</label>
        <textarea
          value={task.improvedDescription}
          onChange={(e) => setTask({ ...task, improvedDescription: e.target.value })}
          className="w-full p-2 border rounded-md h-24 h-[150px] text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white-700 mb-1">Suggested Duration (mins)</label>
        <input
          type="number"
          value={task.suggestedDuration}
          onChange={(e) => setTask({ ...task, suggestedDuration: e.target.value })}
          className="w-full p-2 border rounded-md text-black"
        />
      </div>

      {/* Accept and Reject Buttons */}
      <div className="flex justify-between">
        <button 
          onClick={handleAccept} 
          className="w-1/2 bg-blue-600 hover:bg-green-800 text-white font-semibold py-2 rounded-md mr-2"
        >
          Accept & Save
        </button>

        <button 
          onClick={handleReject} 
          className="w-1/2 bg-blue-600 hover:bg-red-800 text-white font-semibold py-2 rounded-md ml-2"
        >
          Reject & Save Original
        </button>
      </div>
    </div>
  );
}

export default AiSuggestedTask;
