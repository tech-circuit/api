const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false
    },
    members: {
        type: Object,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    founding_year: {
        type: Number,
        required: true
    },
    founder: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    logo_url: {
        type: String,
        required: false
    },
    admin: {
        type: Array,
        required: true
    },
    links: {
        type: Object,
        required: false
    }
})

const Club = mongoose.model('Club', ClubSchema);

module.exports = Club;