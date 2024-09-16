const router = require("express").Router();

const Worker = require("../models/wokersModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/usersModel");
const Task = require("../models/TaskModel")

// add-worker
router.post("/add-worker", authMiddleware, async (req, res) => {
  try {
    const { workerEmail, workerName, workerContactNumber, workerPosition, isAdmin, isBlocked, profilePicture } = req.body;

    // Check if worker already exists in the Worker model
    const existingWorker = await Worker.findOne({ workerEmail });
    if (existingWorker) {
      return res.status(200).send({
        success: false,
        message: "Worker already exists",
      });
    }

    const user = await User.findOne({ email: workerEmail });
    
    // Create the worker in the Worker model with a reference to the user
    const newWorker = new Worker({
      workerName: user.name,
      workerEmail: user.email,
      workerContactNumber,
      workerPosition,
      userId: user._id, // Link the worker to the user
      isAdmin,          // Admin status
      isBlocked,        // Blocked status
      profilePicture,   // Profile picture
    });

    // Save the worker
    await newWorker.save();

    // Update the user's isWorker field to true
    user.isWorker = true;
    user.isAdmin = isAdmin
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Worker added successfully and linked with a User",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});



// update-worker
// update-worker
router.post("/update-worker", authMiddleware, async (req, res) => {
  try {
    const { workerEmail, workerName, workerContactNumber, workerPosition, isAdmin, isBlocked, profilePicture } = req.body;

    // Update the worker data
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.body._id,
      {
        workerName,
        workerEmail,
        workerContactNumber,
        workerPosition,
        isAdmin,
        isBlocked,
        profilePicture,
      },
      { new: true } // Return the updated worker document
    );

    if (!updatedWorker) {
      return res.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }

    // Find the corresponding user and update the email and admin status
    const user = await User.findById(updatedWorker.userId);
    if (user) {
      user.email = workerEmail;
      user.isAdmin = isAdmin;
      await user.save();
    }

    return res.status(200).send({
      success: true,
      message: "Worker updated successfully",
      data: updatedWorker,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


// delete-worker
router.post("/delete-worker", authMiddleware, async (req, res) => {
  try {
    // Find the worker by ID
    const worker = await Worker.findById(req.body._id);
    
    if (!worker) {
      return res.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }

    // Delete the worker
    await Worker.findByIdAndDelete(req.body._id);


    // Find the corresponding user and update the isWorker field to false
    const user = await User.findById(worker.userId);
    if (user) {
      user.isWorker = false;
      user.isAdmin = false ;
      await user.save();
    }

    return res.status(200).send({
      success: true,
      message: "Worker deleted successfully and user updated",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


// get-all-workers
router.post("/get-all-workers", authMiddleware, async (req, res) => {
  try {
    const workers = await Worker.find();
    return res.status(200).send({
      success: true,
      message: "Workers fetched successfully",
      data: workers,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// get-worker-by-id
router.get("/get-worker-by-id", authMiddleware, async (req, res) => {
  try {
    // Fetch worker by user ID from token (use req.user.id)
    const worker = await Worker.findOne({ userId: req.user.id });

    if (!worker) {
      return res.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Worker fetched successfully",
      data: worker,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});
// Worker Performance API
// Worker Performance API
router.get("/performance", authMiddleware, async (req, res) => {
  try {
    // Find the worker by their user ID (from the decoded token)
    const worker = await Worker.findOne({ userId: req.user.id });

    if (!worker) {
      return res.status(404).send({ success: false, message: "Worker not found" });
    }

    // Fetch tasks assigned to this worker
    const tasks = await Task.find({ assignedTo: worker._id });

    // Calculate completed tasks and total tasks
    const completedTasks = tasks.filter((task) => task.progress === 100).length;
    const totalTasks = tasks.length;
    
    res.status(200).send({
      success: true,
      message: "Worker performance fetched successfully",
      data: {
        completedTasks,
        totalTasks,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch performance",
      error: error.message,
    });
  }
});




// list-workers (limited to 3, similar to your example)
router.post("/list-workers", authMiddleware, async (req, res) => {
  try {
    const workers = await Worker.find().sort({ _id: -1 }).limit(3);
    res.send({
      success: true,
      message: "Workers listed successfully",
      data: workers,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
