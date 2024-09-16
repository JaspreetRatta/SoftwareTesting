const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    teamLead: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
});

module.exports = mongoose.model('Team', TeamSchema);
