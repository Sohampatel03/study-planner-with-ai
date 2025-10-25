import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

function TaskList() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        try {
          console.log("Token from localStorage:", localStorage.getItem("token"));
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
        }
      }
    };
  
    fetchTasks();
  }, [user]);
  
  console.log(tasks,"task")
  return (
    <div className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg w-full mx-auto mt-2 sm:mt-3 md:mt-5 text-white">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Task List</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm sm:text-base">No tasks available.</p>
      ) : (
        <ul className="space-y-2 sm:space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="border border-gray-600 p-3 sm:p-4 rounded-md transition hover:bg-gray-700"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Title: {task.title}</h3>
              {/* <p className="text-white-800">Description: {task.description}</p> */}
              <p className="text-xs sm:text-sm text-yellow-400 mb-3">
                <strong>Status:</strong> {task.status}
              </p>
              <Link
                to={`/task/${task._id}`}
                className="inline-block bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-blue-600 text-xs sm:text-sm transition-colors"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
