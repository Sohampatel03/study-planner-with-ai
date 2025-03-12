const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
    remaining: {
        type: Number,
        default: 0, // Ensure it starts at 0
    },
    completed: {
        type: Number,
        default: 0,
    },
});

const Progress = mongoose.model("Progress", ProgressSchema);


module.exports = Progress;
