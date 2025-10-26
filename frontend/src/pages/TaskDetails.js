// frontend/src/pages/TaskDetails.js (Enhanced Version)
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "", date: "" });

  useEffect(() => {
    setLoading(true);
    fetch(`https://study-planner-with-ai-1.onrender.com/tasks/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch task");
        return res.json();
      })
      .then((data) => {
        setTask(data);
        setFormData({ 
          title: data.title, 
          description: data.description, 
          date: data.date?.split('T')[0] 
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await fetch(`https://study-planner-with-ai-1.onrender.com/tasks/${id}`, { 
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        navigate("/dashboard");
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`https://study-planner-with-ai-1.onrender.com/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...formData }),
      });
      setIsEditing(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'from-green-500 to-emerald-600';
      case 'pending': return 'from-yellow-500 to-orange-600';
      case 'in progress': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'in progress': return '🔄';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 
            border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Task Not Found</h2>
          <p className="text-gray-400 mb-6">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>

        {isEditing ? (
          /* Edit Mode */
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl 
            shadow-2xl border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>✏️</span>
              Edit Task
            </h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white font-medium text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                    text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium text-sm">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                    text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium text-sm">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                    text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                    hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl 
                    transition-all duration-200 hover:scale-[1.02]"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold 
                    rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* View Mode */
          <div className="space-y-6">
            {/* Task Header Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl 
              shadow-2xl border border-gray-700/50">
              
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className={`px-4 py-2 bg-gradient-to-r ${getStatusColor(task.status)} 
                  rounded-full text-white font-medium text-sm flex items-center gap-2 shadow-lg`}>
                  <span>{getStatusIcon(task.status)}</span>
                  <span>{task.status || 'Pending'}</span>
                </div>
                
                {task.category && (
                  <div className="px-4 py-2 bg-gray-700/50 rounded-full text-gray-300 text-sm">
                    {task.category}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {task.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {task.date && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <span>{new Date(task.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                )}
                {task.duration && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏱️</span>
                    <span>{task.duration} minutes</span>
                  </div>
                )}
                {task.elapsedTime && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⌛</span>
                    <span>{task.elapsedTime} mins completed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl 
              shadow-2xl border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📝</span>
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </div>

            {/* Progress Card (if task has elapsed time) */}
            {task.duration && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl 
                shadow-2xl border border-gray-700/50">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📊</span>
                  Progress
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time Spent</span>
                    <span className="text-white font-medium">
                      {task.elapsedTime || 0} / {task.duration} mins
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full 
                        transition-all duration-500"
                      style={{ 
                        width: `${Math.min((task.elapsedTime || 0) / task.duration * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>
                      {Math.min(Math.round((task.elapsedTime || 0) / task.duration * 100), 100)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 py-4 bg-blue-600 
                  hover:bg-blue-700 text-white font-semibold rounded-xl transition-all 
                  duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30"
              >
                <span className="text-xl">✏️</span>
                <span>Edit Task</span>
              </button>

              <button
                onClick={() => navigate(`/timer/${id}`)}
                className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r 
                  from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                  text-white font-semibold rounded-xl transition-all duration-200 
                  hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30"
              >
                <span className="text-xl">▶️</span>
                <span>Start Timer</span>
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 py-4 bg-red-600 
                  hover:bg-red-700 text-white font-semibold rounded-xl transition-all 
                  duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30"
              >
                <span className="text-xl">🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;