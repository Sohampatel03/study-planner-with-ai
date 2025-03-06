const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/studyplanner')
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  duration: Number,
  status: { type: String, default: "pending" },
});

const Task = mongoose.model("Task", taskSchema);

// API Routes
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).send(task);
});

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: "Task deleted successfully!" });
});
// Get task by ID
app.get("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).send({ error: "Task not found" });
  }
  res.send(task);
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).send({ message: "Error updating task" });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
