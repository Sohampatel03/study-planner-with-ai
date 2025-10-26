// frontend/src/pages/TimerPage.js
// FINAL COMPLETE VERSION - COPY THIS ENTIRE FILE

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TimerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDuration, setTaskDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  // Convert seconds to hh:mm:ss format
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Convert minutes to hh:mm format
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Fetch saved timer when component mounts
  useEffect(() => {
    const fetchTaskTime = async () => {
      try {
        const response = await fetch(`https://study-planner-with-ai-1.onrender.com/tasks/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (data) {
          setSeconds((data.elapsedTime || 0) * 60);
          setTaskTitle(data.title);
          setTaskDuration(data.duration);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task:", error);
        setLoading(false);
      }
    };

    fetchTaskTime();
  }, [id]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Update elapsed time in database
  const updateTaskTime = async () => {
    try {
      const minutesElapsed = Math.floor(seconds / 60);
      const response = await fetch(`https://study-planner-with-ai-1.onrender.com/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ elapsedTime: minutesElapsed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update elapsed time");
      }
    } catch (error) {
      console.error("Error updating elapsed time:", error);
    }
  };

  // Pause button handler
  const handlePause = async () => {
    setIsRunning(false);
    await updateTaskTime();
  };

  // Back button handler
  const handleBack = async () => {
    if (isRunning) {
      setIsRunning(false);
    }
    await updateTaskTime();
    navigate("/dashboard");
  };

  // Calculate progress percentage
  const progress = taskDuration ? Math.min((seconds / 60 / taskDuration) * 100, 100) : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading timer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4 overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Main Timer Card */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-2xl border border-gray-700/50">
          
          {/* Task Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {taskTitle || "Study Session"}
            </h1>
            {taskDuration && (
              <p className="text-gray-400 flex items-center justify-center gap-2">
                <span>🎯</span>
                <span>Goal: {formatDuration(taskDuration)}</span>
              </p>
            )}
          </div>

          {/* Progress Ring */}
          {taskDuration && (
            <div className="mb-8">
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">{Math.round(progress)}%</p>
                    <p className="text-sm text-gray-400">Complete</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timer Display */}
          <div className="mb-8">
            <div className="text-6xl sm:text-7xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {formatTime(seconds)}
            </div>
            <p className="text-center text-gray-400 text-sm">
              {Math.floor(seconds / 60)} minutes elapsed
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => {
                if (isRunning) {
                  handlePause();
                } else {
                  setIsRunning(true);
                }
              }}
              className={`w-24 h-24 rounded-full text-white font-bold text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl
                ${isRunning 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-yellow-500/50' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/50'
                }`}
            >
              {isRunning ? (
                <div className="flex flex-col items-center">
                  <span className="text-3xl">⏸️</span>
                  <span className="text-xs mt-1">Pause</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-3xl">▶️</span>
                  <span className="text-xs mt-1">Start</span>
                </div>
              )}
            </button>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <p className="text-gray-400 text-xs mb-1">Total Time</p>
              <p className="text-white font-semibold">{formatTime(seconds)}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 text-center">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-gray-400 text-xs mb-1">Remaining</p>
              <p className="text-white font-semibold">
                {taskDuration 
                  ? Math.max(0, taskDuration - Math.floor(seconds / 60)) + " mins"
                  : "N/A"
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBack}
              className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>💾</span>
              <span>Save & Exit</span>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-xl">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">Focus Tip</h4>
              <p className="text-sm text-gray-400">
                Take a 5-minute break every 25 minutes to maintain productivity!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerPage;