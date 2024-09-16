const express = require('express');
const router = express.Router();
const Team = require('../models/TeamModel');

// Create a new team
router.post('/', async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find().populate('members teamLead');
        res.json(teams);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
