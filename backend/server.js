const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cohere = require("cohere-ai");

require("dotenv").config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Cohere API outside API route  
cohere.init(process.env.COHERE_API_KEY);
console.log(process.env.COHERE_API_KEY,"api");

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
// Create a new task
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).send(task);
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(task);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: "Task deleted successfully!" });
});

// Get a task by ID
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

// AI Suggestion API Route
app.post("/ai-suggest", async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const prompt = `Improve this task description and suggest an ideal duration:\nTitle: ${title}\nDescription: ${description}\nDuration: ${duration} minutes.`;

    const response = await cohere.generate({
      model: "command",
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    const aiText = response.body?.generations?.[0]?.text || "No response received.";
    
    res.json({ title, improvedDescription: aiText, suggestedDuration: duration });
  } catch (error) {
    console.error("Error fetching AI suggestion:", error);
    res.status(500).json({ message: "Error fetching AI suggestion" });
  }
});
// Save Task API (Accept or Reject AI Suggestion)
app.post("/save-task", async (req, res) => {
  try {
    const { title, description, date, duration, isAiSuggested } = req.body;

    const task = new Task({
      title,
      description,
      date,
      duration,
      isAiSuggested, // true if AI suggestion is accepted, false if rejected
    });

    await task.save();
    res.status(201).json({ message: "Task saved successfully!", task });
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(500).json({ message: "Error saving task" });
  }
});


// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));

