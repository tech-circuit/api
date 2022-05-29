const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    uploader: {
        type: String,
        required: true,
    },
    upload_date: {
        type: Date,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    institute: {
        type: String,
    },
    isIndependant: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    lastDate: {
        type: Date,
    },
    host: {
        type: String,
        required: true,
    },
    eligibility: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    org: {
        type: String,
    },
    website: {
        type: String,
        required: true,
    },
    links: {
        type: Object,
    },
    email: {
        type: String,
    },
    phone: String,
    cover_image: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
    },
    tags: {
        type: Array,
        default: [],
    },
    regLink: {
        type: String,
        required: true,
    },
    fields: Array,
});

const Event = mongoose.model("event", EventSchema);

module.exports = Event;
