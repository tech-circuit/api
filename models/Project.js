const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    cover_image: {
        type: String,
        required: true
    },
    authors: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    fields: {
        type: Array,
        required: false
    },
    links: {
        type: Object,
        required: true
    },
    upload_date: {
        type: Date,
        required: true
    },
    uploader: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },
    for_event: {
        type: String,
        required: false
    },
    upvotes: {
        type: Number,
        default: 0
    }
})

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;