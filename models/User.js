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
    about: {
        type: String,
        required: false
    },
    org: {
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
    upvotes: {
        type: Object,
        default: {}
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;