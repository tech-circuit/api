const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false
    },
    members: {
        type: Array,
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
        type: Array,
        required: false
    },
    alumni: {
        type: Array,
        required: false
    }
})

const Org = mongoose.model('Org', OrgSchema);

module.exports = Org;