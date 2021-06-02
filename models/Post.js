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
    image_url: {
        type: String,
        required: false
    },
    discussion: {
        type: String,
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    }
})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;