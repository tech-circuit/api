const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')

router.get('/', async(req, res) => {
    let sort = req.query.sort
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
    }
    await Post.find({ is_draft: false })
        .sort({ date: -1 })
        .then(async(posts) => {
            for (let index = 0; index < posts.length; index++) {
                responsePost = {
                    id: posts[index]._id,
                    title: posts[index].title,
                    content: posts[index].content,
                    is_upvoted: false,
                    is_saved: false,
                    author: '',
                    date: posts[index].date,
                    comments: 0
                }
                let author = await User.findOne({ _id: posts[index].author })
                responsePost.author = author.username
                if (user) {
                    posts[index].upvotes.every(upvote => {
                        if (upvote.user == user._id) {
                            responsePost.is_upvoted = true
                            return false
                        }
                        return true
                    })
                    user.saves.every(save => {
                        if (save == posts[index]._id) {
                            responsePost.is_saved = true
                            return false
                        }
                        return true
                    })
                }
                let comments = await Comment.find({ details: { type: 'post', id: posts[index]._id } })
                responsePost.comments = comments.length
                response.posts.push(responsePost)
            }
            if (sort == 'latest') {
                res.json(response)
            } else if (sort == 'hottest') {

            }
        })
})

router.get('/post/:id', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    let post = await Post.findOne({ _id: req.params.id })
    let response = {
        success: true,
        authenticated: false,
        drafts: 0,
        post_id: req.params.id,
        title: post.title,
        content: post.content,
        is_upvoted: false,
        is_saved: false,
        author: '',
        date: post.date,
        comments: []
    }
    if (user) {
        response.authenticated = true
        let drafts = await Post.find({ is_draft: true, author: user._id })
        response.drafts = drafts.length
    }
    let author = await User.findOne({ _id: post.author })
    response.author = author.username
    if (user) {
        post.upvotes.every(upvote => {
            if (upvote.user == user._id) {
                response.is_upvoted = true
                return false
            }
            return true
        })
        user.saves.every(save => {
            if (save == post._id) {
                response.is_saved = true
                return false
            }
            return true
        })
    }
    let comments = await Comment.find({ details: { type: 'post', id: post._id } }).sort({ date: -1 })
    for (let i = 0; i < comments.length; i++) {
        let commentAuthor = await User.findOne({ _id: comments[i].author })
        comments[i].author_name = commentAuthor.name
        comments[i].author_username = commentAuthor.username
        comments[i].pfp_url = commentAuthor.pfp_url
    }
    response.comments = comments
    res.json(response)
})

router.post('/new', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let post = new Post({
            author: user._id,
            date: Date.now(),
            title: req.body.title,
            content: req.body.content,
            is_draft: req.body.is_draft
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