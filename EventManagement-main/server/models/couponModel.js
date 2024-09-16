const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  discount: {
    type: Number,
    required: true,
  },
  point: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('coupons', couponSchema);
