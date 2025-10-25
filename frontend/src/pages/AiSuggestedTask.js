import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function AiSuggestedTask() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract AI-suggested task and original user input
  const { originalTask, aiTask } = location.state || { originalTask: {}, aiTask: {} };
  console.log({originalTask},"taskoriginal");
  const [task, setTask] = useState(aiTask || {});
  const userId = localStorage.getItem("userId");
  // Function to handle Accept (Save AI suggestion)
  const handleAccept = async () => {
    // Keep the original title and duration, update only the description
    const updatedTask = {
      userId,
      ...originalTask, // Keep title and duration the same
      description: aiTask.improvedDescription, // Update only the description
    };
  
    console.log("Updated Task Data before sending:", updatedTask);
  
    const response = await fetch("https://study-planner-with-ai-1.onrender.com/save-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is being added here
      },
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
    const updatedTask = { ...originalTask, userId };
    const response = await fetch("http://localhost:5000/save-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is being added here
      },
      body: JSON.stringify(updatedTask), // Save original task
    });

    if (response.ok) {
      alert("Original task saved successfully!");
      navigate("/"); // Redirect to home page
    } else {
      alert("Error saving task.");
    }
  };

  return (
    <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto p-4 sm:p-6 bg-gray-800 mt-8 sm:mt-11 shadow-lg rounded-lg text-white">
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">AI-Suggested Task</h2>

      <div className="mb-3 sm:mb-4">
        <label className="block text-white mb-1 text-sm sm:text-base">Title</label>
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="w-full p-2 sm:p-3 border rounded-md text-black bg-gray-100 text-sm sm:text-base"
        />
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block text-white mb-1 text-sm sm:text-base">Improved Description</label>
        <textarea
          value={task.improvedDescription}
          onChange={(e) => setTask({ ...task, improvedDescription: e.target.value })}
          className="w-full p-2 sm:p-3 border rounded-md h-24 sm:h-[150px] text-black bg-gray-100 text-sm sm:text-base"
        />
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block text-white mb-1 text-sm sm:text-base">Suggested Duration (mins)</label>
        <input
          type="number"
          value={task.suggestedDuration}
          onChange={(e) => setTask({ ...task, suggestedDuration: e.target.value })}
          className="w-full p-2 sm:p-3 border rounded-md text-black bg-gray-100 text-sm sm:text-base"
        />
      </div>

      {/* Accept and Reject Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
        <button 
          onClick={handleAccept} 
          className="flex-1 bg-green-600 hover:bg-green-800 text-white font-semibold py-2 sm:py-3 rounded-md text-sm sm:text-base transition-colors"
        >
          Accept & Save
        </button>

        <button 
          onClick={handleReject} 
          className="flex-1 bg-red-600 hover:bg-red-800 text-white font-semibold py-2 sm:py-3 rounded-md text-sm sm:text-base transition-colors"
        >
          Reject & Save Original
        </button>
      </div>
    </div>
  );
}

export default AiSuggestedTask;
