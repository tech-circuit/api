const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    upload_date: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    organisers: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    reg_last_date: {
        type: Date,
        required: true
    },
    hosting_method: {
        type: String,
        required: true
    },
    eligibility: {
        type: String,
        required: true
    },
    event_start_date: {
        type: Date,
        required: true
    },
    event_end_date: {
        type: Date,
        required: true
    },
    org: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    links: {
        type: Object,
        required: false
    },
    email_address: {
        type: Array,
        required: true
    },
    banner: {
        type: String,
        required: true
    }
})

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;