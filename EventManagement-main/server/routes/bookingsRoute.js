const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingsModel");
const BookingTour = require("../models/bookingsTourModel");
const Tour = require("../models/tourModel");
const Bus = require("../models/busModel");
const User = require("../models/usersModel");
const stripe = require("stripe")(process.env.stripe_key);
const { v4: uuidv4 } = require("uuid");
// book a seat

router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      user: req.user.id,
    });
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus);
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
    await bus.save();
    if (req.body.discount) {
      await removePoint(req.user.id, req.body.discount);
    }
    await addPoint(req.user.id);
    res.status(200).send({
      message: "Booking successful",
      data: newBooking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking failed",
      data: error,
      success: false,
    });
  }
});

router.post("/book-tour", authMiddleware, async (req, res) => {
  try {
    const newBooking = new BookingTour({
      ...req.body,
      user: req.user.id,
    });
    await newBooking.save();
    if (req.body.discount) {
      await removePoint(req.user.id, req.body.discount);
    }
    await addPoint(req.user.id);

    res.status(200).send({
      message: "Booking successful",
      data: newBooking,
      success: true,
    });
  } catch (error) {}
});

// make payment

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: amount,
        currency: "THB",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      res.status(200).send({
        message: "Payment successful",
        data: {
          transactionId: payment.source.id,
        },
        success: true,
      });
    } else {
      res.status(500).send({
        message: "Payment failed",
        data: error,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Payment failed",
      data: error,
      success: false,
    });
  }
});

// get bookings by user id
router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("bus").populate("tour").populate("user");
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
});

router.post("/get-bookings-by-user-id-tour", authMiddleware, async (req, res) => {
  try {
    const bookings = await BookingTour.find({ user: req.user.id }).populate("tour").populate("user");
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
});

// get all bookings
router.post("/get-all-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user").populate("tour");
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
});

router.post("/get-all-bookings-tour", authMiddleware, async (req, res) => {
  try {
    const bookings = await BookingTour.find()
    .populate("tour")
    .populate("user")
   
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
});



const addPoint = async (id) => {
  try {
    const user = await User.findById(id);
    if (user && user.point > 0) {
      user.point += 15;
    } else {
      user.point = 15;
    }
    await user.save();
    return true;
  } catch (error) {
    return false;
  }
};



const removePoint = async (id, point) => {
  try {
    const user = await User.findById(id);
    if (user && user.point > 0) {
      user.point = user.point - point;
    }
    await user.save();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = router;
