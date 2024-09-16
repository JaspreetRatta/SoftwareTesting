const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel");
const ReviewTour = require("../models/reviewTourModel")
const Booking = require("../models/bookingsModel.js")
const BookingTour = require("../models/bookingsTourModel")
const mongoose = require("mongoose");

router.post("/create",  async (req, res) => {
    try {
        const booking_id = req.body.booking_id;
        console.log(booking_id);

        const bookingObjectId = mongoose.Types.ObjectId(booking_id);
        console.log(bookingObjectId);

        await Booking.findByIdAndUpdate(bookingObjectId,
          { reviewStatus: true }
        );
        const review = new Review(req.body);
        await review.save();
        return res.status(200).send({
          success: true,
          message: "Review successfully",
        });

        res.send(review)
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: error.message });
      }

  });

router.post("/create_review",  async (req, res) => {
    try {
  
        const booking_id = req.body.booking_id;
        console.log(booking_id);

        const bookingObjectId = mongoose.Types.ObjectId(booking_id);
        console.log(bookingObjectId);

        await BookingTour.findByIdAndUpdate(bookingObjectId,
          { reviewStatus: true }
        );
        const review = new ReviewTour(req.body);
        await review.save();
        return res.status(200).send({
          success: true,
          message: "Review successfully",
        });

        res.send(review)
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: error.message });
      }

  });

  router.post("/read_tour",async (req, res) => {
    try {
      const Tour_id = req.body
      const ReviewTours = await ReviewTour.find({ tour_id:Tour_id});
      console.log(ReviewTours);
      res.send(ReviewTours);
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  });

  router.post("/read_bus",async (req, res) => {
    try {
      const Bus_id = req.body
      const ReviewBus = await Review.find({ bus_id:Bus_id});
      console.log(ReviewBus);
      res.send(ReviewBus);
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  });



module.exports = router;
