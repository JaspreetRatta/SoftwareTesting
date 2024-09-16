const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  journeyDate: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
  },
  duration: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
  },
  category:{
    type:String,
    default:"tour"
  },
  eventStatus: {
    type: String,
    default: "Soon",
  },

  venue :     { 
  type: String,
  required: true,
},
});

module.exports = mongoose.model("tour", tourSchema);
