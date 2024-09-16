const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
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
  type:{
    type:String
  },
  name:{
    type:String
  },
  numbus:{
    type:Number
  },
  comment:{
    type:String
  },
  bus_id: {
    type: mongoose.Schema.ObjectId, 
    ref: "buses",
    required: true
  }
});

module.exports = mongoose.model("review", reviewSchema);
