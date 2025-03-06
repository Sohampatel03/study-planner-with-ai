import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <button 
        onClick={() => navigate("/add-task")} 
        className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
      >
        + Add Task
      </button>
    </header>
  );
};

export default Header;
