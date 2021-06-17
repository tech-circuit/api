const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')

router.get('/latest', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    let response = {
        success: true,
        authenticated: false,
        drafts: 0,
        posts: []
    }
    if (user) {
        response.authenticated = true
        let drafts = await Post.find({ is_draft: true, author: user._id })
        response.drafts = drafts.length
        await Post.find({ is_draft: false })
            .sort({ date: 'asc' })
            .then(async(posts) => {
                posts.forEach(async(post, index) => {
                    responsePost = {
                        title: post.title,
                        content: post.content,
                        is_upvoted: false,
                        is_saved: false,
                        author: '',
                        date: post.date,
                        comments: 0
                    }
                    let author = await User.findOne({ _id: post.author })
                    responsePost.author = author.username
                    post.upvotes.every(upvote => {
                        if (upvote.user == user._id) {
                            responsePost.is_upvoted = true
                            return false
                        }
                        return true
                    })
                    user.saves.every(save => {
                        if (save == post._id) {
                            responsePost.is_saved = true
                            return false
                        }
                        return true
                    })
                    let comments = await Comment.find({ details: { type: 'post', id: post._id } })
                    responsePost.comments = comments.length
                    response.posts.push(responsePost)
                    if (index == (posts.length - 1)) {
                        res.json(response)
                    }
                })
            })
    } else {

    }
})

router.post('/new', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let post = new Post({
            author: user._id,
            date: Date.now(),
            title: req.body.title,
            content: req.body.content,
            is_draft: false
        })
        await post.save()
        res.json({ success: true })
    } else {
        res.json({ success: false, error: 'User not found.' })
    }
})

router.post('/upvote/:post_id', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let post = await Post.findOne({ _id: req.params.post_id })
        if (post) {
            post.upvotes.push({ user: user._id, date: Date.now() })
            await Post.findOneAndUpdate({ _id: req.params.post_id }, { upvotes: post.upvotes })
            res.json({ success: true })
        } else {
            res.json({ success: false, error: 'Post not found.' })
        }
    } else {
        res.json({ success: false, error: 'User not found.' })
    }
})

router.post('/unupvote/:post_id', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let post = await Post.findOne({ _id: req.params.post_id })
        if (post) {
            let i = post.upvotes.length;
            while (i--) {
                if (post.upvotes[i] &&
                    post.upvotes[i].hasOwnProperty(user) &&
                    (arguments.length > 2 && post.upvotes[i][user] === user._id)) {
                    post.upvotes.splice(i, 1);
                }
            }
            await Post.findOneAndUpdate({ _id: req.params.post_id }, { upvotes: post.upvotes })
            res.json({ success: true })
        } else {
            res.json({ success: false, error: 'Post not found.' })
        }
    } else {
        res.json({ success: false, error: 'User not found.' })
    }
})

module.exports = router