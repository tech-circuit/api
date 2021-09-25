const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    post: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;