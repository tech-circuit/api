const mongoose = require('mongoose');

const MailingListEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

const MailingListEmail = mongoose.model('MailingListEmail', MailingListEmailSchema);

module.exports = MailingListEmail;