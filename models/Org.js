const mongoose = require("mongoose");

const OrgSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: false,
        },
        members: {
            type: Array,
            required: false,
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
            required: false,
        },
        institute: {
            type: String,
        },
        isIndependent: {
            type: Boolean,
            required: true,
        },
        logo_url: {
            type: String,
            required: false,
        },
        admins: {
            type: Array,
            required: true,
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
        invites: Array,
    },
    { timestamps: true }
);

const Org = mongoose.model("Org", OrgSchema);

module.exports = Org;
