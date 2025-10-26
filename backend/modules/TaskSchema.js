// backend/modules/TaskSchema.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true // Add index for faster queries
    },
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String,
      trim: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    duration: { 
      type: Number,
      default: 0 
    },
    status: { 
      type: String, 
      enum: ['pending', 'in progress', 'completed'],
      default: "pending" 
    },
    category: {
      type: String,
      enum: ['study', 'assignment', 'exam', 'project', 'reading'],
      default: 'study'
    },
    isAiSuggested: { 
      type: Boolean, 
      default: false 
    },
    originalTitle: String,
    originalDescription: String,
    elapsedTime: { 
      type: Number, 
      default: 0 
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  { 
    timestamps: true // Adds createdAt & updatedAt
  }
);

// Index for faster queries
taskSchema.index({ userId: 1, date: 1 });
taskSchema.index({ userId: 1, status: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;