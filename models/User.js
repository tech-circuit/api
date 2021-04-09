const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    access_token: {
        type: String,
        required: true
    },
    pfp_url: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    given_name: {
        type: String,
        required: false
    },
    family_name: {
        type: String,
        required: false
    },
    google_id: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    club: {
        type: Object,
        required: false
    },
    discord_auth: {
        type: Object,
        required: false
    },
    socials: {
        type: Object,
        required: false
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;