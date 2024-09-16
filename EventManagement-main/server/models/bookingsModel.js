const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.ObjectId,
      ref: "buses",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "tour",
    },
    seats: {
      type: Array,
    },
    transactionId: {
      type: String,
      require: true,
    },
    reviewStatus: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: "bus",
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("bookings", bookingSchema);
