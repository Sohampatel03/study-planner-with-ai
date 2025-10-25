import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await fetch("https://study-planner-with-ai-1.onrender.com/logout", {
        method: "POST",
        //  credentials:true,
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

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-800 shadow-md p-2 sm:p-4 flex justify-between items-center text-white">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Task Manager</h1>
      <div className="flex gap-1 sm:gap-2 md:gap-4">
        {user && <button
          onClick={() => navigate("/add-task")}
          className="bg-blue-500 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md hover:bg-blue-600 text-xs sm:text-sm md:text-base transition-colors"
        >
          <span className="hidden sm:inline">+ Add Task</span>
          <span className="sm:hidden">+</span>
        </button> }
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md hover:bg-red-600 text-xs sm:text-sm md:text-base transition-colors"
          >
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
