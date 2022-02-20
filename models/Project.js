const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        cover_image: {
            type: String,
            required: false,
        },
        collaborators: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: true,
        },
        fields: {
            type: Array,
            required: false,
        },
        links: {
            type: Array,
            required: false,
        },
        uploader: {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        event: {
            type: String,
            required: false,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
