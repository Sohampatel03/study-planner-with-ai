import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", date: "" });

  useEffect(() => {
    fetch(`http://localhost:5000/tasks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTask(data);
        setFormData({ title: data.title, description: data.description, date: data.date });
      });
  }, [id]);
  const handleDelete = () => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => navigate("/")) // Redirect to home after delete
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setIsEditing(false);
    navigate(`/`); // Redirect to homepage after update
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[50%] mx-auto mt-5 text-white">
      {task ? (
        isEditing ? (
          <form onSubmit={handleUpdate}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="p-2 w-full mb-2 bg-gray-700 text-white" />
            <textarea name="description" value={formData.description} onChange={handleChange} className="p-2 w-full h-[200px] mb-2 bg-gray-700 text-white"></textarea>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2 w-full mb-2 bg-gray-700 text-white" />
            <button type="submit" className="bg-blue-500 px-4 py-2 rounded">Save Changes</button>
          </form>
        ) : (
          <>
            <h2 className="text-xl font-bold">Title: {task.title}</h2>
            <p>Description: {task.description}</p>
            <p><strong>Date:</strong> {task.date}</p>
            <div className="flex justify-between items-center mt-4">
            <button onClick={handleEditClick} className="bg-blue-500 px-4 py-2 rounded mt-3  hover:bg-blue-600">Edit Task</button>
            <button
          onClick={handleDelete}
          className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
        >
          Delete Task
        </button>
        </div>
          </>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TaskDetails;
