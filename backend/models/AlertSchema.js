const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    level: {
        type: String,
        enum: ['danger', 'warning', 'info']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date
    }
});

module.exports = mongoose.model('Alert', alertSchema);
