import React, { useEffect, useState } from "react";

const TaskProgress = () => {
  const [remaining, setRemaining] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const response = await fetch("https://study-planner-with-ai-1.onrender.com/progress");
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
    <div className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg w-full mx-auto mt-2 sm:mt-3 md:mt-5">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">📊 Task Progress</h2>

      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6 md:space-x-12 space-y-4 sm:space-y-0">
        {/* Completed Tasks Progress */}
        <div className="text-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
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
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg">
              {completed}
            </span>
          </div>
          <p className="text-white mt-2 text-sm sm:text-base md:text-lg font-semibold">Completed</p>
        </div>

        {/* Remaining Tasks Progress */}
        <div className="text-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
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
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg">
              {remaining}
            </span>
          </div>
          <p className="text-white mt-2 text-sm sm:text-base md:text-lg font-semibold">Remaining</p>
        </div>
      </div>

      {/* Task Details */}
      <div className="mt-4 sm:mt-6 text-center text-white text-sm sm:text-base md:text-lg">
        <h3 className="mb-1 sm:mb-2">✅ Completed Tasks: <span className="text-green-400">{completed}</span></h3>
        <h3>⚡ Remaining Tasks: <span className="text-yellow-400">{remaining}</span></h3>
      </div>

      {/* Badge Section */}
      <h1 className="text-sm sm:text-base md:text-lg font-bold text-white mt-4 sm:mt-6 text-center">🏆 Badges</h1>
      <div className="flex justify-center sm:justify-start mt-2 sm:mt-4">
        <img
          src="https://ih1.redbubble.net/image.5226491706.2802/st,small,507x507-pad,600x600,f8f8f8.jpg"
          alt="Completed Task Badge"
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-[50%]"
        />
      </div>
    </div>
  );
};

export default TaskProgress;
