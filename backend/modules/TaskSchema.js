const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: { type: Date, required: true }, // Change from String to Date type
    duration: Number,
    status: { type: String, default: "pending" },
    isAiSuggested: { type: Boolean, default: false },
    originalTitle: String,
    originalDescription: String,
    elapsedTime: { type: Number, default: 0 }, // Store accumulated time
  }, { timestamps: true }); // Adds createdAt & updatedAt fields
  
  const Task = mongoose.model("Task", taskSchema);

  module.exports = Task;