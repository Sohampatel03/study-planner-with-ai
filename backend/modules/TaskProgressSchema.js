// backend/modules/TaskProgressSchema.js
const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // Each user has only one progress document
        index: true
    },
    remaining: {
        type: Number,
        default: 0,
        min: 0
    },
    completed: {
        type: Number,
        default: 0,
        min: 0
    },
    totalTasksCreated: {
        type: Number,
        default: 0,
        min: 0
    },
    totalStudyTime: {
        type: Number,
        default: 0, // Total minutes studied
        min: 0
    },
    streak: {
        type: Number,
        default: 0, // Days in a row with completed tasks
        min: 0
    },
    lastActivityDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Method to calculate completion rate
ProgressSchema.methods.getCompletionRate = function() {
    if (this.totalTasksCreated === 0) return 0;
    return Math.round((this.completed / this.totalTasksCreated) * 100);
};

// Method to update streak
ProgressSchema.methods.updateStreak = function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActivity = new Date(this.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
        this.streak += 1;
    } else if (daysDiff > 1) {
        this.streak = 1;
    }
    // If daysDiff === 0, keep the same streak
    
    this.lastActivityDate = new Date();
    return this.save();
};

const Progress = mongoose.model("Progress", ProgressSchema);

module.exports = Progress;