const router = require('express').Router();
const Coupon = require('../models/couponModel');
const authMiddleware = require('../middlewares/authMiddleware');

// add-coupon

router.post('/add-coupon', authMiddleware, async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    return res.status(200).send({
      success: true,
      message: 'Coupon added successfully',
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// update-coupon

router.post('/update-coupon', authMiddleware, async (req, res) => {
  try {
    await Coupon.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: 'Coupon updated successfully',
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// delete-coupon

router.post('/delete-coupon', authMiddleware, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// get-all-coupon

router.post('/get-all-coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find(req.body);
    return res.status(200).send({
      success: true,
      message: 'Coupones fetched successfully',
      data: coupons,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// get-coupon-by-id

router.post('/get-coupon-by-id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: 'Coupon fetched successfully',
      data: coupon,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post('/list-coupon', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ point: 1 }).limit(3);
    res.send(coupons);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
