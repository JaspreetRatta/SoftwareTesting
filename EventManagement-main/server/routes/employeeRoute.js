const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/EmployeeModel'); // Ensure this path is correct const authMiddleware = require('../middlewares/authMiddleware');
const authMiddleware = require("../middlewares/authMiddleware");

 
// Add a new employee
router.post('/add', authMiddleware, async (req, res) => { 
  try {
      const newEmployee = new Employee(req.body);
      await newEmployee.save();
      res.status(201).send({
          message: 'Employee added successfully',
          success: true,
      });
  } catch (error) {
      res.status(500).send({ success: false, message: error.message });
  }
});


    // update-Employee

router.post("/update-Employee", authMiddleware, async (req, res) => {
    try {
      await Employee.findByIdAndUpdate(req.body._id, req.body);
      return res.status(200).send({
        success: true,
  
        message: "Employee updated successfully",
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  });

// delete-Employee

router.post("/delete-Employee", authMiddleware, async (req, res) => {
    try {
      await Employee.findByIdAndDelete(req.body._id);
      return res.status(200).send({
        success: true,

        message: "Employee deleted successfully",
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  });


// Get all employees
router.post('/get-all-employees', authMiddleware, async (req, res) => { // Removed authMiddleware for testing purposes
    try {
        const employees = await Employee.find().populate('team');
        res.status(200).send({
            message: 'Employees fetched successfully',
            success: true,
            data: employees,
        });
      } catch (error) {
        res.send({
          message: error.message,
          success: false,
          data: null,
        });
      }
    });
// Assign employee to a team
router.post('/:id/assign-team', authMiddleware, async (req, res) => { // Removed authMiddleware for testing purposes
    try {
        const { teamId } = req.body;
        const employees = await Employee.findByIdAndUpdate(
            req.params.id,
            { team: teamId },
            { new: true }
        );
        res.status(200).send({
            message: 'Employee assigned to team successfully',
            success: true,
          
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        
        });
    }
});

module.exports = router;
