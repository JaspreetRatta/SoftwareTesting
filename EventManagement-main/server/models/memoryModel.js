
const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  title: String,
  location: String,
  date: Date,
  description: Object,
  images: [String], // You can store image URLs here
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to the User model
  },
});

module.exports = mongoose.model('Memory', memorySchema);