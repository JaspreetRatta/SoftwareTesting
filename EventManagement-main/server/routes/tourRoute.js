const express = require("express");
const router = express.Router();
const Tour = require("../models/tourModel.js");
// const authMiddleware = require("../middlewares/authMiddleware");


router.post("/create",  async (req, res) => {
  try {
    console.log(req.body);
    const existing = await Tour.findOne({title: req.body.title });
    if (existing) {
      return res.status(200).send({
        success: false,
        message: "Title already exists",
      });
    }
    const newTour = new Tour(req.body);
    await newTour.save();
    return res.status(200).send({
      success: true,
      message: "Event added successfully",
    });
    res.send(newTour);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post("/list", async (req, res) => {
  try {
    const tour = await Tour.find({}).exec();
    res.send(tour);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post("/remove", async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Event deleted successfully",
    });

    res.send(tour);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post("/read",async (req, res) => {
  try {
    const tour = await Tour.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Event fetched successfully",
      data: tour,
    });

    res.send(tour);

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post("/update", async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: "Event updated successfully",
    });
 
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post("/list-tour", async (req, res) => {
  try {
    const tour = await Tour.find().sort({ _id: -1 }).limit(4);
    res.send(tour);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
