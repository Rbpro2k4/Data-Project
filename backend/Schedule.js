const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Description: String,
    StartTime: {
        type: Date,
        required: true
    },
    EndTime: {
        type: Date,
        required: true
    },
    Invited: [{
        type: String,  // Store email addresses
        required: true
    }],
    Status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);