const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cohere = require("cohere-ai");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Cohere API
cohere.init(process.env.COHERE_API_KEY);
console.log("Cohere API Key Loaded");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/studyplanner", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  duration: Number,
  status: { type: String, default: "pending" },
  isAiSuggested: { type: Boolean, default: false },
  originalTitle: String,
  originalDescription: String,
});

const Task = mongoose.model("Task", taskSchema);

// API Routes
// Create a new task
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).send(task);
});

// Step 1: User submits a task (gets AI suggestion)
app.post("/ai-suggest", async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const prompt = `I am creating an AI-powered study planner. The user wants to study: ${title}.
Provide the best learning resources in the following format:

YouTube Resource(answer in 30words): A relevant YouTube video or channel.
Official Documentation / Trusted Article(only 2name): A link to official documentation or a well-trusted article.
Book / Online Course (if applicable)(only 2name): A recommended book or an online course.
Website for Practice(only 2name): Suggest website name for practice or gives test or exams.
Ensure all recommendations are high-quality and relevant to the topic.`;

    const response = await cohere.generate({
      model: "command",
      prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    if (!response || !response.body || !response.body.generations) {
      return res.status(500).json({ message: "AI suggestion failed" });
    }

    const improvedDescription = response.body.generations[0]?.text?.trim() || description;

    res.json({
      title,
      originalTitle: title,
      originalDescription: description,
      improvedDescription,
      suggestedDuration: duration,
    });
  } catch (error) {
    console.error("Error fetching AI suggestion:", error);
    res.status(500).json({ message: "Error fetching AI suggestion", error });
  }
});

// Step 2: User accepts or rejects AI suggestion (task is saved)
app.post("/save-task", async (req, res) => {
  try {
    const { title, description, date, duration, isAiSuggested, originalTitle, originalDescription } = req.body;

    const task = new Task({
      title,
      description,
      date,
      duration,
      isAiSuggested, // true if AI suggestion is accepted, false if rejected
      originalTitle,
      originalDescription,
    });

    await task.save();
    res.status(201).json({ message: "Task saved successfully!", task });
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(500).json({ message: "Error saving task", error });
  }
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Get a task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
