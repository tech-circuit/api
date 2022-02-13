const mongoose = require("mongoose");

const OrgSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    members: {
        type: Array,
        required: false, //change to true?
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    website_url: {
        type: String,
        required: false, //change to true // nhi bhai nhi
    },
    institute: {
        type: String,
    },
    isIndependant: {
        type: Boolean,
        required: true, //change to true
    },
    logo_url: {
        type: String,
        required: false,
    },
    admin: {
        type: Array,
        required: false, //change to true?
    },
    links: {
        type: Array,
        required: false,
    },
    alumni: {
        type: Array,
        required: false,
    },
    requests: Array,
});

const Org = mongoose.model("Org", OrgSchema);

module.exports = Org;
