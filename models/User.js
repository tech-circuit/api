const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    access_token: {
        type: String,
        required: true
    },
    verify_token: {
        type: String,
        required: false
    },
    pending_credentials: {
        type: {
            password: String,
            username: String,
            verified: Boolean
        },
        required: false
    },
    password: {
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    pfp_url: {
        type: String,
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
    about: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    skills: {
        type: Array,
        required: false
    },
    discord_auth: {
        type: Object,
        required: false
    },
    links: {
        type: Array,
        required: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    saves: {
        type: Array,
        default: []
    },
    setUp: {
        type: Boolean,
        required: false
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;