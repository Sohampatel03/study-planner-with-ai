// backend/server.js
// COMPLETE ENHANCED VERSION WITH PER-USER PROGRESS

const { GoogleGenAI } = require("@google/genai");
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
    origin: "https://study-planner-with-ai.vercel.app",
    credentials: true,
  })
);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Blacklisted tokens for logout
const blacklistedTokens = new Set();

// Auth Middleware
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
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// ============================================
// AUTH ROUTES
// ============================================

// Register User
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Create initial progress for user
    const progress = new Progress({ 
      userId: newUser._id,
      remaining: 0,
      completed: 0,
      totalTasksCreated: 0
    });
    await progress.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
      expiresIn: "24h" // Extended to 24 hours
    });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Logout Route
app.post("/logout", authMiddleware, (req, res) => {
  const token = req.header("Authorization").split(" ")[1];
  blacklistedTokens.add(token);
  res.json({ message: "Logged out successfully" });
});

// Get User Data (Protected)
app.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
});

// ============================================
// TASK ROUTES
// ============================================

// Create a new task
app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      userId: req.user.id
    };

    const task = new Task(taskData);
    await task.save();

    // Update user's progress - increment remaining and totalTasksCreated
    let progress = await Progress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = new Progress({ 
        userId: req.user.id,
        remaining: 1,
        completed: 0,
        totalTasksCreated: 1
      });
    } else {
      progress.remaining += 1;
      progress.totalTasksCreated += 1;
    }
    
    await progress.save();

    res.status(201).json({ 
      message: "Task created successfully", 
      task 
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
});

// AI Suggestion for Task
app.post("/ai-suggest", authMiddleware, async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    const prompt = `I am creating an AI-powered study planner. The user wants to study: ${title}.
Provide the best learning resources in the following format:

YouTube Resource (max 30 words): 
Official Documentation / Trusted Article (2 names only): 
Book / Online Course (2 names only): 
Website for Practice (2 names only): 
Ensure all recommendations are high-quality and relevant to the topic.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const improvedDescription = response.text?.trim() || description;

    res.json({
      title,
      originalTitle: title,
      originalDescription: description,
      improvedDescription,
      suggestedDuration: duration,
    });
  } catch (error) {
    console.error("AI suggestion error:", error);
    res.status(500).json({ message: "Error fetching AI suggestion", error: error.message });
  }
});

// Save a task (after AI suggestion)
app.post("/save-task", authMiddleware, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      date, 
      duration, 
      category,
      isAiSuggested, 
      originalTitle, 
      originalDescription 
    } = req.body;

    const task = new Task({
      userId: req.user.id,
      title,
      description,
      date,
      duration,
      category,
      isAiSuggested,
      originalTitle,
      originalDescription,
    });

    await task.save();

    // Update user's progress
    let progress = await Progress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = new Progress({ 
        userId: req.user.id,
        remaining: 1,
        completed: 0,
        totalTasksCreated: 1
      });
    } else {
      progress.remaining += 1;
      progress.totalTasksCreated += 1;
    }
    
    await progress.save();

    res.status(201).json({ message: "Task saved successfully!", task });
  } catch (error) {
    console.error("Save task error:", error);
    res.status(500).json({ message: "Error saving task", error: error.message });
  }
});

// Get all tasks for logged-in user
app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let query = { userId: req.user.id };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const tasks = await Task.find(query).sort({ date: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// Get a single task by ID
app.get("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id // Ensure user owns this task
    });
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ error: "Error fetching task", message: error.message });
  }
});

// Update a task
app.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { elapsedTime, status, ...updateFields } = req.body;
    
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const wasCompleted = task.status === 'completed';
    
    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        ...updateFields, 
        ...(elapsedTime !== undefined ? { elapsedTime } : {}),
        ...(status ? { status } : {})
      },
      { new: true }
    );

    // Get user's progress
    let progress = await Progress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = new Progress({ userId: req.user.id });
    }

    // Check if task is now completed and wasn't before
    if (status === 'completed' && !wasCompleted) {
      progress.completed += 1;
      if (progress.remaining > 0) {
        progress.remaining -= 1;
      }
      await progress.updateStreak(); // Update streak
    }
    
    // Check if task was completed but now isn't
    if (wasCompleted && status && status !== 'completed') {
      if (progress.completed > 0) {
        progress.completed -= 1;
      }
      progress.remaining += 1;
    }

    // Add elapsed time to total study time
    if (elapsedTime !== undefined && elapsedTime > task.elapsedTime) {
      progress.totalStudyTime += (elapsedTime - task.elapsedTime);
    }

    await progress.save();

    res.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Error updating task", message: error.message });
  }
});

// Delete a task
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Update user's progress
    let progress = await Progress.findOne({ userId: req.user.id });
    
    if (progress) {
      if (task.status === 'completed' && progress.completed > 0) {
        progress.completed -= 1;
      } else if (progress.remaining > 0) {
        progress.remaining -= 1;
      }
      
      if (progress.totalTasksCreated > 0) {
        progress.totalTasksCreated -= 1;
      }
      
      await progress.save();
    }

    res.json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});

// ============================================
// PROGRESS ROUTES
// ============================================

// Get progress for logged-in user
app.get("/progress", authMiddleware, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = new Progress({ 
        userId: req.user.id,
        remaining: 0,
        completed: 0,
        totalTasksCreated: 0
      });
      await progress.save();
    }
    
    res.json({
      remaining: progress.remaining,
      completed: progress.completed,
      totalTasksCreated: progress.totalTasksCreated,
      totalStudyTime: progress.totalStudyTime,
      streak: progress.streak,
      completionRate: progress.getCompletionRate()
    });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ error: "Error fetching progress", message: error.message });
  }
});

// Get user statistics
app.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get progress
    const progress = await Progress.findOne({ userId });
    
    // Get tasks statistics
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ userId, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ userId, status: 'in progress' });
    
    // Get tasks by category
    const tasksByCategory = await Task.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      progress: progress || { remaining: 0, completed: 0, streak: 0 },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks
      },
      categories: tasksByCategory
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Error fetching statistics", message: error.message });
  }
});

// ============================================
// SERVER
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});