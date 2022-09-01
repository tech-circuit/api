const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        cover: { type: String, required: true },
        imgs: {
            type: Array,
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
            type: [String],
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
        commentsEnabled: {
            type: Boolean,
            required: true,
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
