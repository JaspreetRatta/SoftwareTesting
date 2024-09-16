const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
      unique: true,
      sparse: true
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: null,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profilePicture: {
      type: String,
      default: 'default-profile-picture.jpg', // Set a default profile picture
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employee', EmployeeSchema);

