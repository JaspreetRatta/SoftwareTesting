const mongoose = require("mongoose");

const reviewTourSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  title:{
    type:String
  },
  comment:{
    type:String
  },
  tour_id: {
    type: mongoose.Schema.ObjectId, 
    ref: "tour",
    required: true
  }
});

module.exports = mongoose.model("reviewTor", reviewTourSchema);
