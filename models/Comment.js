const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    details: {
        type: Object,
        required: true
    }
})

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;