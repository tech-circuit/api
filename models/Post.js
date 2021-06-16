const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    upvotes: {
        type: Array,
        default: []
    },
    is_draft: {
        type: Boolean,
        required: true
    }
})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;