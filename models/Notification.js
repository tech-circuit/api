const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    typeDetails: {
        type: Object,
        required: true
    },
    meta: {
        type: Object,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
})

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;