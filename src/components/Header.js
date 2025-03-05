import React from "react";

const Header = ({ onAddTask }) => {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={onAddTask}
      >
        + Add Task
      </button>
    </header>
  );
};

export default Header;
