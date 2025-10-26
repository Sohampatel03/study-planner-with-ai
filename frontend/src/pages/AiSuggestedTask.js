// frontend/src/pages/AiSuggestedTask.js
// FINAL COMPLETE VERSION - COPY THIS ENTIRE FILE

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function AiSuggestedTask() {
  const location = useLocation();
  const navigate = useNavigate();
  const { originalTask, aiTask } = location.state || { originalTask: {}, aiTask: {} };
  
  const [task, setTask] = useState(aiTask || {});
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem("userId");

  const handleAccept = async () => {
    const updatedTask = {
      userId,
      ...originalTask,
      description: aiTask.improvedDescription,
    };

    try {
      const response = await fetch("https://study-planner-with-ai-1.onrender.com/save-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert("Error saving task.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save task.");
    }
  };

  const handleReject = async () => {
    const updatedTask = { ...originalTask, userId };
    
    try {
      const response = await fetch("https://study-planner-with-ai-1.onrender.com/save-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert("Error saving task.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save task.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br 
            from-green-500 to-blue-600 rounded-2xl mb-4 text-3xl animate-bounce">
            🤖
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">AI Suggestions Ready!</h2>
          <p className="text-gray-400">Review and choose the best version for your task</p>
        </div>

        {/* Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          {/* Original Task */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl 
            border-2 border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📝</span>
                Your Original
              </h3>
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
                Original
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <p className="text-white font-medium">{originalTask.title}</p>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {originalTask.description || "No description provided"}
                </p>
              </div>
              
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <span>⏱️</span>
                  <span>{originalTask.duration} mins</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📅</span>
                  <span>{new Date(originalTask.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggested Task */}
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-6 rounded-2xl 
            border-2 border-blue-500/50 shadow-xl shadow-blue-500/20 relative overflow-hidden">
            
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>✨</span>
                  AI Enhanced
                </h3>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 
                  text-white rounded-full text-xs font-medium">
                  Recommended
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-blue-300 mb-1 block">Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => setTask({ ...task, title: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-blue-500/30 
                        rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white font-medium">{task.title || originalTask.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-xs text-blue-300 mb-1 block">Enhanced Description</label>
                  {isEditing ? (
                    <textarea
                      value={task.improvedDescription}
                      onChange={(e) => setTask({ ...task, improvedDescription: e.target.value })}
                      rows="5"
                      className="w-full px-3 py-2 bg-gray-900/50 border border-blue-500/30 
                        rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  ) : (
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {task.improvedDescription}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-300">
                    <span>⏱️</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={task.suggestedDuration}
                        onChange={(e) => setTask({ ...task, suggestedDuration: e.target.value })}
                        className="w-20 px-2 py-1 bg-gray-900/50 border border-blue-500/30 
                          rounded text-white text-center"
                      />
                    ) : (
                      <span>{task.suggestedDuration} mins</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 
                    transition-colors"
                >
                  <span>{isEditing ? '💾' : '✏️'}</span>
                  <span>{isEditing ? 'Done Editing' : 'Edit Suggestion'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Improvements Highlighted */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 
          border border-green-500/30 rounded-2xl">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🎯</span>
            AI Improvements
          </h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center 
                flex-shrink-0">
                <span>✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Clearer Goals</p>
                <p className="text-xs text-gray-400">More specific objectives</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center 
                flex-shrink-0">
                <span>✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Better Structure</p>
                <p className="text-xs text-gray-400">Organized approach</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center 
                flex-shrink-0">
                <span>✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Optimal Time</p>
                <p className="text-xs text-gray-400">Realistic duration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAccept}
            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 
              hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl 
              transition-all duration-300 hover:scale-[1.02] hover:shadow-xl 
              hover:shadow-green-500/30 flex items-center justify-center gap-2"
          >
            <span className="text-xl">✅</span>
            <span>Accept AI Suggestion</span>
          </button>

          <button
            onClick={handleReject}
            className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 
              text-white font-semibold rounded-xl transition-all duration-300 
              hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span className="text-xl">📝</span>
            <span>Keep Original</span>
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">Pro Tip</h4>
              <p className="text-sm text-gray-400">
                AI suggestions are based on best study practices. You can edit them before accepting!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiSuggestedTask;