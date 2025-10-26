// frontend/src/pages/AddTask.js (Enhanced Version)
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 40000);

function AddTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    duration: "",
    date: "",
    hours: "",
    minutes: "",
    category: "study"
  });

  const categories = [
    { id: 'study', name: 'Study', icon: '📚', color: 'blue' },
    { id: 'assignment', name: 'Assignment', icon: '📝', color: 'purple' },
    { id: 'exam', name: 'Exam Prep', icon: '🎯', color: 'red' },
    { id: 'project', name: 'Project', icon: '🚀', color: 'green' },
    { id: 'reading', name: 'Reading', icon: '📖', color: 'yellow' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const totalMinutes = parseInt(task.hours || 0) * 60 + parseInt(task.minutes || 0);
    const formattedTask = {
      title: task.title,
      description: task.description,
      duration: totalMinutes,
      date: task.date,
      category: task.category
    };

    try {
      const response = await fetch("https://study-planner-with-ai-1.onrender.com/ai-suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formattedTask),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const aiSuggestedTask = await response.json();
        navigate("/ai-suggested-task", {
          state: { originalTask: formattedTask, aiTask: aiSuggestedTask },
        });
      } else {
        alert("Error fetching AI suggestions.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch AI suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br 
            from-blue-500 to-purple-600 rounded-2xl mb-4 text-3xl">
            ✨
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create New Task</h2>
          <p className="text-gray-400">Let AI help you optimize your study plan</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl 
          shadow-2xl border border-gray-700/50 backdrop-blur-sm">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Task Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white font-medium text-sm">
                <span className="text-lg">📌</span>
                Task Title
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Study for Math Exam"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white font-medium text-sm">
                <span className="text-lg">🏷️</span>
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setTask({ ...task, category: cat.id })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 
                      ${task.category === cat.id
                        ? 'border-blue-500 bg-blue-500/20 scale-105 shadow-lg shadow-blue-500/30'
                        : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                      }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-medium text-white">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white font-medium text-sm">
                <span className="text-lg">📝</span>
                Description
                <span className="text-gray-500 text-xs font-normal">(optional)</span>
              </label>
              <textarea
                value={task.description}
                placeholder="Add details about your task..."
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white font-medium text-sm">
                <span className="text-lg">⏱️</span>
                Expected Duration
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={task.hours}
                    placeholder="0"
                    onChange={(e) => setTask({ ...task, hours: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                      text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                      focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={task.minutes}
                    placeholder="0"
                    onChange={(e) => setTask({ ...task, minutes: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                      text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                      focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white font-medium text-sm">
                <span className="text-lg">📅</span>
                Task Date
                <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={task.date}
                onChange={(e) => setTask({ ...task, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                  text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-3 py-4 rounded-xl 
                font-semibold text-lg transition-all duration-300 
                ${loading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" 
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Getting AI Suggestions...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">✨</span>
                  <span>Get AI Suggestion</span>
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl 
                font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">AI-Powered Optimization</h4>
              <p className="text-sm text-gray-400">
                Our AI will analyze your task and suggest improvements to help you study more effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTask;