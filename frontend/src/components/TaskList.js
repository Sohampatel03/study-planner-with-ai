// frontend/src/components/TaskList.js (Enhanced Version)
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

function TaskList() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await fetch("https://study-planner-with-ai-1.onrender.com/tasks", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }
  
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchTasks();
  }, [user]);

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-800/50 p-4 rounded-xl animate-pulse border border-gray-700">
          <div className="h-5 bg-gray-700 rounded w-2/3 mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-3"></div>
          <div className="h-10 bg-gray-700 rounded w-24"></div>
        </div>
      ))}
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="text-7xl mb-4 animate-bounce">📝</div>
      <h3 className="text-xl font-semibold mb-2 text-white">No tasks yet</h3>
      <p className="text-gray-400 mb-6">Start by creating your first task to get organized!</p>
      <Link 
        to="/add-task"
        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
          rounded-xl font-semibold transition-all duration-300 hover:scale-105 
          hover:shadow-lg hover:shadow-blue-500/50"
      >
        Create Task
      </Link>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-2xl 
      shadow-2xl border border-gray-700/50 w-full mx-auto mt-3 md:mt-5 backdrop-blur-sm">
      
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Task List
          {!loading && (
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({filteredTasks.length})
            </span>
          )}
        </h2>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg border border-gray-700">
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                ${filter === f 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredTasks.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task, index) => (
            <li
              key={task._id}
              className="group relative bg-gradient-to-r from-gray-800/80 to-gray-800/50 
                border border-gray-700/50 p-4 rounded-xl transition-all duration-300 
                hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 
                hover:scale-[1.02] overflow-hidden"
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 
                group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 
                rounded-xl pointer-events-none"></div>

              <div className="relative z-10">
                {/* Task Header */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 
                    transition-colors duration-200 flex-1 pr-2">
                    {task.title}
                  </h3>
                  
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border 
                    ${getStatusColor(task.status)} whitespace-nowrap`}>
                    {task.status || 'Pending'}
                  </span>
                </div>

                {/* Task Meta Info */}
                <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-400 mb-3">
                  {task.date && (
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{new Date(task.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {task.duration && (
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{task.duration} mins</span>
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <Link
                  to={`/task/${task._id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 
                    hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg 
                    transition-all duration-200 text-xs sm:text-sm font-medium 
                    group-hover:shadow-lg group-hover:shadow-blue-500/30"
                >
                  View Details
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default TaskList;