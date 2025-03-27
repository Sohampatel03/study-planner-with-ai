import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", date: "" });

  useEffect(() => {
  fetch(`http://localhost:5000/tasks/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch task");
      }
      return res.json();
    })
    .then((data) => {
      setTask(data);
      setFormData({ title: data.title, description: data.description, date: data.date });
    })
    .catch((error) => {
      console.error("Error fetching task:", error);
    });
}, [id]);


  const handleDelete = () => {
    fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" , headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is being added here
    }, })
      .then(() => navigate("/"))
      .catch((err) => console.error("Error deleting task:", err));
  };

  const handleEditClick = () => setIsEditing(true);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is being added here
      },
      body: JSON.stringify({ ...formData }),
    });

    setIsEditing(false);
    navigate(`/`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      {task ? (
        isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
            />
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="w-full p-3 h-40 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            ></textarea>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white font-semibold">Save Changes</button>
          </form>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
            <p className="text-gray-300 mb-4">{task.description}</p>
            <p className="text-sm text-gray-400 mb-6">Date: {task.date}</p>
            <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4">
              <button onClick={handleEditClick} className="flex-1 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white font-semibold">Edit</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-white font-semibold">Delete</button>
              <button onClick={() => navigate(`/timer/${id}`)} className="flex-1 bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg text-white font-semibold">Start Task</button>
            </div>
          </>
        )
      ) : (
        <p className="text-center text-gray-400">Loading...</p>
      )}
    </div>
  );
}

export default TaskDetails;
