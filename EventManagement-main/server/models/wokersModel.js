const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    workerName: {
      type: String,
      required: true,
    },
    workerEmail: {
      type: String,
      required: true,
      unique: true, // Ensures each worker has a unique email
    },
    workerContactNumber: {
      type: String,
      required: true,
      unique: true, // Ensures each worker has a unique contact number
    },
    workerPosition: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      profilePicture: {
        type: String,
        default: 'default-profile-picture.jpg', // Set a default profile picture
      },
      assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Add reference to Task
    },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", workerSchema);
