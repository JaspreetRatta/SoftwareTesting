const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const Memory = require("../models/memoryModel");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require('../config/multer.js');
const { uploadFile } = require("../middlewares/cloudinary.js")

// add-memory
router.post("/add-memory", upload.fields([{ name: 'images', maxCount: 20 }]), async (req, res) => {
  try {
    let body = req.body;
    const images = [];
    if (req?.files['images']) {
      for (const file of req.files['images']) {
        const fileName = path.resolve(__dirname, '../uploads/' + file.filename)
        const result = await uploadFile(fileName, 'memory')
        images.push(result.url);
        fs.unlinkSync(fileName);
      }
    }
    body.images = images;
    const newMemory = new Memory(body);
    await newMemory.save();
    return res.status(200).send({
      success: true,
      message: "Memory added successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// update-memory
router.post("/update-memory", async (req, res) => {
  try {
    await Memory.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: "Memory updated successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// delete-memory
router.post("/delete-memory", async (req, res) => {
  try {
    await Memory.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Memory deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// get-all-memories
router.get("/get-all-memories", async (req, res) => {
  try {
    const memories = await Memory.find(req.body);
    return res.status(200).send({
      success: true,
      message: "Memories fetched successfully",
      data: memories,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Get a memory by ID
router.get("/get-memory-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const memory = await Memory.findById(id);
    if (!memory) {
      return res.status(404).send({
        success: false,
        message: "Memory not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Memory fetched successfully",
      data: memory,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
