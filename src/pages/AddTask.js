import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Task:", { taskName, taskDuration });

    // Navigate back to home after submission
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white text-black rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Task Name:
          <input 
            type="text" 
            value={taskName} 
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>

        <label className="block mb-4">
          Duration (mins):
          <input 
            type="number" 
            value={taskDuration} 
            onChange={(e) => setTaskDuration(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>

        <div className="flex justify-between">
          <button 
            type="button" 
            onClick={() => navigate("/")} 
            className="bg-gray-400 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-blue-500 px-4 py-2 rounded text-white"
          >
            Save Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
