import React from "react";

const TaskProgress = ({ completed, remaining }) => {
  const totalTasks = completed + remaining;
  const completedPercentage = totalTasks === 0 ? 0 : (completed / totalTasks) * 100;
  const remainingPercentage = 100 - completedPercentage;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 w-80">
      <h2 className="text-lg font-bold text-white mb-4">Task Progress</h2>

      <div className="flex justify-center space-x-8">
        {/* Completed Tasks Progress */}
        <div className="text-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-700"
                strokeWidth="3.8"
                fill="none"
                stroke="currentColor"
                d="M18 2.0845 a 15.9155 15.9155 0 1 0 0.00001 31.831"
              />
              <path
                className="text-green-500"
                strokeWidth="3.8"
                fill="none"
                strokeDasharray={`${completedPercentage}, 100`}
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 1 0 0.00001 31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
              {completed}
            </span>
          </div>
          <p className="text-white mt-2">Completed</p>
        </div>

        {/* Remaining Tasks Progress */}
        <div className="text-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-700"
                strokeWidth="3.8"
                fill="none"
                stroke="currentColor"
                d="M18 2.0845 a 15.9155 15.9155 0 1 0 0.00001 31.831"
              />
              <path
                className="text-yellow-500"
                strokeWidth="3.8"
                fill="none"
                strokeDasharray={`${remainingPercentage}, 100`}
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 1 0 0.00001 31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
              {remaining}
            </span>
          </div>
          <p className="text-white mt-2">Remaining</p>
        </div>
      </div>

      <div className="mt-4 text-center text-white">
        <h3>Remaining Tasks: {remaining}</h3>
        <h3>Completed Tasks: {completed}</h3>
      </div>
    </div>
  );
};

export default TaskProgress;
