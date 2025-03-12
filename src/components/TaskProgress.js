import React, { useEffect, useState } from "react";

const TaskProgress = () => {
  const [remaining, setRemaining] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const response = await fetch("http://localhost:5000/progress");
      const data = await response.json();
      setRemaining(data.remaining || 0);
      setCompleted(data.completed || 0);
    };

    fetchProgress();
  }, []);

  // Limits
  const MAX_REMAINING = 50;
  const MAX_COMPLETED = 20;

  // Progress calculations based on limits
  const completedPercentage = Math.min((completed / MAX_COMPLETED) * 100, 100);
  const remainingPercentage = Math.min((remaining / MAX_REMAINING) * 100, 100);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 mx-auto mt-5 h[screen]">
      <h2 className="text-xl font-bold text-white mb-6 text-center">📊 Task Progress</h2>

      <div className="flex justify-center space-x-12">
        {/* Completed Tasks Progress */}
        <div className="text-center">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <circle
                className="text-gray-700"
                strokeWidth="3.5"
                fill="none"
                stroke="currentColor"
                cx="18"
                cy="18"
                r="15.9155"
              />
              {/* Progress Circle */}
              <circle
                className="text-green-500 transition-all duration-500 ease-out"
                strokeWidth="3.5"
                fill="none"
                strokeDasharray="100, 100"
                strokeDashoffset={`${100 - completedPercentage}`}
                strokeLinecap="round"
                stroke="currentColor"
                cx="18"
                cy="18"
                r="15.9155"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              {completed}
            </span>
          </div>
          <p className="text-white mt-2 text-lg font-semibold">Completed</p>
        </div>

        {/* Remaining Tasks Progress */}
        <div className="text-center">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <circle
                className="text-gray-700"
                strokeWidth="3.5"
                fill="none"
                stroke="currentColor"
                cx="18"
                cy="18"
                r="15.9155"
              />
              {/* Progress Circle */}
              <circle
                className="text-yellow-500 transition-all duration-500 ease-out"
                strokeWidth="3.5"
                fill="none"
                strokeDasharray="100, 100"
                strokeDashoffset={`${100 - remainingPercentage}`}
                strokeLinecap="round"
                stroke="currentColor"
                cx="18"
                cy="18"
                r="15.9155"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              {remaining}
            </span>
          </div>
          <p className="text-white mt-2 text-lg font-semibold">Remaining</p>
        </div>
      </div>

      {/* Task Details */}
      <div className="mt-6 text-center text-white text-lg">
        <h3>✅ Completed Tasks: <span className="text-green-400">{completed}</span></h3>
        <h3>⚡ Remaining Tasks: <span className="text-yellow-400">{remaining}</span></h3>
      </div>

      {/* Badge Section */}
      <h1 className="text-lg font-bold text-white mt-6 text-center">🏆 Badges</h1>
    </div>
  );
};

export default TaskProgress;
