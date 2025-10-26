// frontend/src/components/Header.js (Enhanced Version)
import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("https://study-planner-with-ai-1.onrender.com/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      } else {
        console.error("Failed to log out.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-md 
      shadow-lg border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and Brand */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 
              rounded-lg flex items-center justify-center text-2xl transform 
              group-hover:scale-110 transition-transform duration-200">
              📚
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                bg-clip-text text-transparent">
                StudyPlanner AI
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Powered by AI</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <NavButton 
              onClick={() => navigate('/dashboard')}
              active={isActive('/dashboard')}
              icon="🏠"
              text="Dashboard"
            />
            <NavButton 
              onClick={() => navigate('/add-task')}
              active={isActive('/add-task')}
              icon="➕"
              text="Add Task"
            />
            <NavButton 
              onClick={() => navigate('/calendar')}
              active={isActive('/calendar')}
              icon="📅"
              text="Calendar"
            />
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Add Button - Desktop */}
            <button
              onClick={() => navigate("/add-task")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r 
                from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 
                hover:to-purple-700 transition-all duration-200 hover:scale-105 
                hover:shadow-lg hover:shadow-blue-500/30 font-medium"
            >
              <span className="text-xl">➕</span>
              <span className="hidden lg:inline">New Task</span>
            </button>

            {/* Mobile Quick Add */}
            <button
              onClick={() => navigate("/add-task")}
              className="sm:hidden p-2 bg-blue-500 rounded-lg hover:bg-blue-600 
                transition-colors"
            >
              <span className="text-xl">➕</span>
            </button>

            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 
                    rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 
                    rounded-full flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user?.name || 'User'}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setShowMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg 
                      shadow-xl border border-gray-700 overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 
                          transition-colors flex items-center gap-2"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around py-2 border-t border-gray-800">
          <MobileNavButton 
            onClick={() => navigate('/dashboard')}
            active={isActive('/dashboard')}
            icon="🏠"
            text="Home"
          />
          <MobileNavButton 
            onClick={() => navigate('/add-task')}
            active={isActive('/add-task')}
            icon="➕"
            text="Add"
          />
          <MobileNavButton 
            onClick={() => navigate('/calendar')}
            active={isActive('/calendar')}
            icon="📅"
            text="Calendar"
          />
        </div>
      </div>
    </header>
  );
};

// Desktop Navigation Button Component
const NavButton = ({ onClick, active, icon, text }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 
      flex items-center gap-2 ${
      active 
        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`}
  >
    <span>{icon}</span>
    <span>{text}</span>
  </button>
);

// Mobile Navigation Button Component
const MobileNavButton = ({ onClick, active, icon, text }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg 
      transition-all duration-200 ${
      active 
        ? 'text-blue-400' 
        : 'text-gray-400 hover:text-white'
    }`}
  >
    <span className="text-xl mb-1">{icon}</span>
    <span className="text-xs font-medium">{text}</span>
  </button>
);

export default Header;