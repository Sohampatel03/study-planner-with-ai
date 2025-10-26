// frontend/src/components/TaskProgress.js
// UPDATED VERSION FOR NEW BACKEND WITH AUTH

import React, { useEffect, useState } from "react";

const TaskProgress = () => {
  const [remaining, setRemaining] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // ✅ IMPORTANT: Add Authorization header
        const response = await fetch("https://study-planner-with-ai-1.onrender.com/progress", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch progress");
        }
        
        const data = await response.json();
        setRemaining(data.remaining || 0);
        setCompleted(data.completed || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching progress:", error);
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const MAX_REMAINING = 50;
  const MAX_COMPLETED = 20;
  const completedPercentage = Math.min((completed / MAX_COMPLETED) * 100, 100);
  const remainingPercentage = Math.min((remaining / MAX_REMAINING) * 100, 100);
  const totalTasks = completed + remaining;
  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl 
        border border-gray-700/50 w-full mx-auto mt-5 backdrop-blur-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
          <div className="flex justify-center gap-8">
            <div className="w-28 h-28 bg-gray-700 rounded-full"></div>
            <div className="w-28 h-28 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl 
      border border-gray-700/50 w-full mx-auto mt-5 backdrop-blur-sm">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <span className="text-3xl">📊</span>
          <span>Progress Overview</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">Keep up the great work!</p>
      </div>

      {/* Overall Completion Bar */}
      <div className="mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Overall Completion</span>
          <span className="text-lg font-bold text-white">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full 
              transition-all duration-1000 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Progress Circles */}
      <div className="flex justify-center items-center gap-8 mb-8">
        {/* Completed Tasks */}
        <div className="text-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <circle
                className="text-gray-700"
                strokeWidth="3"
                fill="none"
                stroke="currentColor"
                cx="18"
                cy="18"
                r="15.9155"
              />
              {/* Progress Circle */}
              <circle
                className="text-green-500 transition-all duration-1000 ease-out"
                strokeWidth="3"
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
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xl sm:text-2xl">{completed}</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-green-400 font-semibold text-sm sm:text-base">✅ Completed</p>
          </div>
        </div>

        {/* Remaining Tasks */}
        <div className="text-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <circle
                className="text-gray-700"
                strokeWidth="3"
                fill="none"
                stroke="currentColor"
                cx="18"
                cy="18"
                r="15.9155"
              />
              {/* Progress Circle */}
              <circle
                className="text-yellow-500 transition-all duration-1000 ease-out"
                strokeWidth="3"
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
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xl sm:text-2xl">{remaining}</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-yellow-400 font-semibold text-sm sm:text-base">⏳ Remaining</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 p-4 rounded-xl 
          border border-green-500/30">
          <div className="text-2xl mb-2">✅</div>
          <p className="text-xs text-gray-400 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-400">{completed}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 p-4 rounded-xl 
          border border-yellow-500/30">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-xs text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{remaining}</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span>🏆</span>
          <span>Recent Badges</span>
        </h3>
        <div className="flex justify-start gap-3 overflow-x-auto">
          {completed >= 1 && (
            <div className="relative group flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 
                rounded-full flex items-center justify-center text-2xl border-2 
                border-yellow-400 shadow-lg shadow-yellow-500/30 cursor-pointer
                hover:scale-110 transition-transform">
                🎯
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 
                transition-opacity whitespace-nowrap pointer-events-none">
                First Task
              </div>
            </div>
          )}
          {completed >= 5 && (
            <div className="relative group flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 
                rounded-full flex items-center justify-center text-2xl border-2 
                border-blue-400 shadow-lg shadow-blue-500/30 cursor-pointer
                hover:scale-110 transition-transform">
                ⚡
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 
                transition-opacity whitespace-nowrap pointer-events-none">
                5 Tasks Done
              </div>
            </div>
          )}
          {completed >= 10 && (
            <div className="relative group flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 
                rounded-full flex items-center justify-center text-2xl border-2 
                border-green-400 shadow-lg shadow-green-500/30 cursor-pointer
                hover:scale-110 transition-transform">
                🚀
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 
                transition-opacity whitespace-nowrap pointer-events-none">
                10 Tasks Done
              </div>
            </div>
          )}
          {completed === 0 && (
            <p className="text-gray-500 text-sm italic">Complete tasks to earn badges!</p>
          )}
        </div>
      </div>

      {/* Motivational Message */}
      {remaining > 0 && (
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex gap-3">
            <span className="text-2xl">💪</span>
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">Keep Going!</h4>
              <p className="text-sm text-gray-400">
                You have {remaining} task{remaining !== 1 ? 's' : ''} remaining. You're doing great!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Message */}
      {remaining === 0 && completed > 0 && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h4 className="text-green-400 font-semibold mb-1">All Done!</h4>
              <p className="text-sm text-gray-400">
                Congratulations! You've completed all your tasks. Time to add some new ones!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskProgress;