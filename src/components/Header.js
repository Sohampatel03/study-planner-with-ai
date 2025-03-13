import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const Header = () => {
  const navigate = useNavigate();

  const { user ,setUser } = useContext(AuthContext); // Import AuthContext

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        localStorage.removeItem("token");
        setUser(null); // **Update user state to null**
        navigate("/login");
      } else {
        console.error("Failed to log out.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/add-task")}
          className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + Add Task
        </button>
        {user && <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>}
      </div>
    </header>
  );
};

export default Header;
