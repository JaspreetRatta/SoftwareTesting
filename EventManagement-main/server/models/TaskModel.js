const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker", // Reference to the Worker model
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  comments: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Task", taskSchema);
