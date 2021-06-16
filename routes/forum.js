const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')

router.get('/', (req, res) => {
    res.send('post')
})

router.post('/new', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let post = new Post({
            author: user._id,
            date: Date.now(),
            title: req.body.title,
            content: req.body.content
        })
        await post.save()
        res.sendStatus(200)
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
            res.sendStatus(200)
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
            res.sendStatus(200)
        } else {
            res.json({ success: false, error: 'Post not found.' })
        }
    } else {
        res.json({ success: false, error: 'User not found.' })
    }
})

module.exports = router