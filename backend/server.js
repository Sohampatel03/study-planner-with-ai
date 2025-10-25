const { CohereClient } = require("cohere-ai");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./modules/TaskSchema");
const Progress = require("./modules/TaskProgressSchema");
const User = require("./modules/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin
    credentials: true, // Allow cookies and authentication headers
  })
);

// Initialize Cohere API
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});
console.log("Cohere API Key Loaded");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

  const blacklistedTokens = new Set();

  const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    const token = authHeader.split(" ")[1];

    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ message: "Token is invalid. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };  // Explicitly set req.user.id
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};


  

// Task Schema
// const taskSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   date: { type: Date, required: true }, // Change from String to Date type
//   duration: Number,
//   status: { type: String, default: "pending" },
//   isAiSuggested: { type: Boolean, default: false },
//   originalTitle: String,
//   originalDescription: String,
//   elapsedTime: { type: Number, default: 0 }, // Store accumulated time
// }, { timestamps: true }); // Adds createdAt & updatedAt fields

// const Task = mongoose.model("Task", taskSchema);

// API Routes
// Register User
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});
//logout route
app.post("/logout",(req, res) => {
  const token = req.header("Authorization").split(" ")[1];
  blacklistedTokens.add(token);
  res.json({ message: "Logged out successfully" });
});



// Get User Data (Protected)
app.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});
// Create a new task
app.post("/tasks",authMiddleware, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    let progress = await Progress.findOneAndUpdate();
    if (!progress) {
        progress = new Progress({ remaining: 1, completed: 0 });
    } else {
        progress.remaining += 1;
    }
    await progress.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// AI Suggestion for Task
app.post("/ai-suggest",authMiddleware, async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const prompt = `I am creating an AI-powered study planner. The user wants to study: ${title}.
Provide the best learning resources in the following format:

YouTube Resource (max 30 words): 
Official Documentation / Trusted Article (2 names only): 
Book / Online Course (2 names only): 
Website for Practice (2 names only): 
Ensure all recommendations are high-quality and relevant to the topic.`;

    const response = await cohere.generate({
      model: "command",
      prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    const improvedDescription = response?.body?.generations?.[0]?.text?.trim() || description;

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

// Save a task
app.post("/save-task",authMiddleware, async (req, res) => {
  try {
    const { title, description, date, duration, isAiSuggested, originalTitle, originalDescription} = req.body;
    // const{user} = req.user.id;
    // console.log(user,"iserid");
    console.log(req.body, "routte date");

    const task = new Task({
      userId: req.user.id,
      title,
      description,
      date,
      duration,
      isAiSuggested,
      originalTitle,
      originalDescription,
    });
    let progress = await Progress.findOneAndUpdate(
      {}, 
      { $inc: { remaining: 1 } },  // Increment `remaining` by 1
      { new: true, upsert: true }  // Return updated document, create if not exists
    );

    console.log(progress,"dfgh");

    await task.save();
    res.status(201).json({ message: "Task saved successfully!", task });
  } catch (error) {
    res.status(500).json({ message: "Error saving task", error });
  }
});

// Get all tasks
app.get("/tasks",authMiddleware, async (req, res) => {
  try {
    console.log(req.user.id , "from server id")
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 }); // Sort by newest tasks first
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Get a single task by ID
app.get("/tasks/:id",authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error fetching task" });
  }
});


// Update a task
app.put("/tasks/:id",authMiddleware, async (req, res) => {
  try {
    const { elapsedTime, ...updateFields } = req.body;
    const task = await Task.findById(req.params.id);
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...updateFields, ...(elapsedTime !== undefined ? { elapsedTime } : {}) },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if elapsedTime matches duration
    if (elapsedTime >= task.duration) {
      let progress = await Progress.findOne();
      if (progress) {
        progress.completed += 1;
        if (progress.remaining > 0) {
          progress.remaining -= 1;
        }
        await progress.save();
      }
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
});



// Delete a task
app.delete("/tasks/:id",authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    let progress = await Progress.findOne();
        if (progress && progress.remaining > 0) {
            progress.remaining -= 1;
            await progress.save();
        }

    res.json({ message: "Task deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

app.get("/progress", async (req, res) => {
  try {
      const progress = await Progress.findOne();
      res.json(progress || { remaining: 0, completed: 0 });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching progress" });
  }
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
