const express = require("express");
const router = express.Router();
const Task = require("../models/TaskModel");
const User = require("../models/usersModel");
const Worker = require("../models/wokersModel");
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");

// Create a new task
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign task to worker (Admin only)
router.post("/assign-task", authMiddleware, async (req, res) => {
  try {
    const { taskName, taskDescription, assignedTo, deadline } = req.body;
    if ((!taskName, !taskDescription, !assignedTo, !deadline)) {
      return res.status.send({ message: "Please all filed needed" });
    }
    // Verify that the worker exists
    const worker = await Worker.findById(assignedTo);
    if (!worker) {
      return res
        .status(400)
        .send({ success: false, message: "Worker not found" });
    }

    // Create a new task and assign it to the worker
    const newTask = new Task({
      taskName,
      taskDescription,
      assignedTo, // This should be the worker's ID
      deadline,
    });

    // Debug: Log the task object before saving
    console.log("Saving task:", newTask);

    await newTask.save(); // This should save the task to the database

    // Update the worker's assignedTasks array
    worker.assignedTasks.push(newTask._id);
    await worker.save();

    res
      .status(200)
      .send({
        success: true,
        message: "Task assigned successfully",
        data: newTask,
      });
  } catch (error) {
    console.log("Error saving task:", error);
    res.status(500).send({ success: false, message: error.message });
  }
});

// Get tasks for worker (Worker only)
router.get("/worker-tasks", authMiddleware, async (req, res) => {
  try {

    const worker = await Worker.findOne({ userId: req.user.id });
    
    const workerID = worker._id.toString();

    // Find tasks where assignedTo matches the worker's ObjectId
    const tasks = await Task.find({ assignedTo: workerID });

    if (!tasks.length) {
      return res
        .status(404)
        .send({ success: false, message: "No tasks found for this worker" });
    }

    res
      .status(200)
      .send({
        success: true,
        message: "Tasks fetched successfully",
        data: tasks,
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, message: error.message });
  }
});

// Update task progress (Worker only)
router.post("/update-task", authMiddleware, async (req, res) => {
  try {
    const { taskId, progress } = req.body;

    // Automatically set status to "Completed" if progress is 100
    const status = progress === 100 ? "Completed" : "Pending";

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { progress, status },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .send({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .send({
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// Add comments to task (Admin only)
router.post("/add-task-comment", authMiddleware, async (req, res) => {
  try {
    const { taskId, comment } = req.body;

    // Add the comment to the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $push: { comments: comment } },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .send({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .send({
        success: true,
        message: "Comment added successfully",
        data: updatedTask,
      });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// get-worker-by-id
router.post("/get-worker-by-id", async (req, res) => {
  try {
    const worker = await Worker.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Worker fetched successfully",
      data: worker,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Analytics API to get task stats
router.get("/analytics", async (req, res) => {
  try {
    // Fetch total tasks
    const totalTasks = await Task.countDocuments({});

    // Fetch completed tasks (assume progress == 100 means completed)
    const completedTasks = await Task.countDocuments({ progress: 100 });

    // Calculate average progress
    const tasks = await Task.find({});
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    const averageProgress = totalTasks > 0 ? totalProgress / totalTasks : 0;

    res.status(200).send({
      totalTasks,
      completedTasks,
      averageProgress,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
