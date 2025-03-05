import React, { useState } from "react";

const TaskList = ({tasks} ) => {
    const taskArray = Object.values(tasks).flat(); // Convert object values to a single array

    console.log(tasks,"arraay")
  const [activeTimers, setActiveTimers] = useState({});

  const startTimer = (taskId, duration) => {
    if (activeTimers[taskId]) return; // Prevent multiple timers for the same task

    const endTime = Date.now() + duration * 60000; // Convert minutes to milliseconds

    setActiveTimers((prevTimers) => ({
      ...prevTimers,
      [taskId]: endTime,
    }));

    const interval = setInterval(() => {
      const remainingTime = Math.max(0, endTime - Date.now());

      if (remainingTime === 0) {
        clearInterval(interval);
        setActiveTimers((prevTimers) => {
          const newTimers = { ...prevTimers };
          delete newTimers[taskId];
          return newTimers;
        });
        alert(`Task "${tasks.find((t) => t.id === taskId)?.name}" is complete!`);
      }
    }, 1000);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-2/3">
      <h2 className="text-lg font-bold mb-4">Your Tasks</h2>
      <ul className="space-y-4">
      {taskArray.length === 0 ? (
  <p className="text-gray-400">No tasks available.</p>
) : (
  taskArray.map((task) => (
    <li key={task.id} className="p-4 bg-gray-700 rounded flex justify-between items-center">
      <div>
        <h3 className="text-white font-semibold">{task.name}</h3>
        <p className="text-gray-400">{task.description}</p>
        <p className="text-yellow-400">Duration: {task.duration} minutes</p>
      </div>
      <button
        onClick={() => startTimer(task.id, task.duration)}
        className={`p-2 rounded text-white ${
          activeTimers[task.id] ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={!!activeTimers[task.id]}
      >
        {activeTimers[task.id] ? "Running..." : "Start"}
      </button>
    </li>
  ))
)}
      </ul>
    </div>
  );
};

export default TaskList;
