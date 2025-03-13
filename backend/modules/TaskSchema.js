const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link task to a user
    title: String,
    description: String,
    date: { type: Date, required: true }, 
    duration: Number,
    status: { type: String, default: "pending" },
    isAiSuggested: { type: Boolean, default: false },
    originalTitle: String,
    originalDescription: String,
    elapsedTime: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
