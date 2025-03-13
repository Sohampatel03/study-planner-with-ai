import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);
  console.log(tasks,"task")
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[100%] mx-auto mt-5 text-white h[screen]">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task._id}
              className="border border-gray-600 p-4 my-2 rounded-md  transition"
            >
              <h3 className="text-lg font-semibold text-white-800">Title: {task.title}</h3>
              {/* <p className="text-white-800">Description: {task.description}</p> */}
              <p className="text-sm text-yellow-400">
                <strong>Status:</strong> {task.status}
              </p>
              <Link
                to={`/task/${task._id}`}
                className="mt-2 inline-block bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
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
