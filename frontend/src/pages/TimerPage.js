import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TimerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDuration, setTaskDuration] = useState(null);

  // Convert time to hh:mm:ss format
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
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  // Fetch saved timer when component mounts
  useEffect(() => {
    const fetchTaskTime = async () => {
      try {
        const response = await fetch(`http://localhost:5000/tasks/${id}`, {
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
          if (data.duration) {
            setTaskDuration(formatDuration(data.duration));
          }
        }
      } catch (error) {
        console.error("Error fetching task:", error);
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

  // Update elapsed time in minutes
  const updateTaskTime = async () => {
    try {
      const minutesElapsed = Math.floor(seconds / 60);
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
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
      console.log("Elapsed time updated successfully", { elapsedTime: minutesElapsed });
    } catch (error) {
      console.error("Error updating elapsed time:", error);
    }
  };

  // Pause button - Save elapsed time
  const handlePause = async () => {
    setIsRunning(false);
    await updateTaskTime();
  };

  // Back button - Save elapsed time and navigate
  const handleBack = async () => {
    await updateTaskTime();
    navigate("/");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md shadow-lg p-8 rounded-2xl w-full max-w-md text-center border border-white/20 mt-[-50px]">
        
        {/* Task Title */}
        <h1 className="text-2xl font-bold text-white mb-2">{taskTitle || "Task Timer"}</h1>

        {/* Task Duration (if available) */}
        {taskDuration && (
          <h2 className="text-lg text-gray-300 mb-4">⏳ Duration: {taskDuration} hrs</h2>
        )}

        {/* Timer Display */}
        <div className="text-5xl font-bold text-white bg-gray-800 py-4 px-6 rounded-lg shadow-md mb-6">
          {formatTime(seconds)}
        </div>

        {/* Button Container - Centering Start/Pause Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (isRunning) {
                handlePause();
              } else {
                setIsRunning(true);
              }
            }}
            className={`w-24 h-24 rounded-full text-xl font-bold transition-all flex items-center justify-center
              ${isRunning ? "bg-yellow-500 hover:bg-yellow-400" : "bg-green-500 hover:bg-green-400"} 
              shadow-lg text-white`}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg mt-6 w-full shadow-lg transition-all"
        >
          Back
        </button>

      </div>
    </div>
  );
}

export default TimerPage;
