const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const Report = require('../models/Report')
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

router.get('/', async(req, res) => {
    if (req.query.page) {
        let sort = req.query.sort
        let skipIndex = (req.query.page - 1) * 20;
        let user = await User.findOne({ access_token: req.query.access_token })
        let response = {
            total_pages: 0,
            success: true,
            authenticated: false,
            drafts: 0,
            posts: []
        }
        let postsPages = await Post.find({ is_draft: false })
        response.total_pages = Math.ceil(postsPages.length / 20)
        if (user) {
            response.authenticated = true
            let drafts = await Post.find({ is_draft: true, author: user._id })
            response.drafts = drafts.length
        }
        await Post.find({ is_draft: false })
            .sort({ date: -1 })
            .limit(20)
            .skip(skipIndex)
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
                            if (String(upvote.user) == String(user._id)) {
                                responsePost.is_upvoted = true
                                return false
                            }
                            return true
                        })
                        user.saves.every(save => {
                            if (String(save) == String(posts[index]._id)) {
                                responsePost.is_saved = true
                                return false
                            }
                            return true
                        })
                    }
                    let comments = await Comment.find({ details: { type: 'post', id: String(posts[index]._id) } })
                    responsePost.comments = comments.length
                    response.posts.push(responsePost)
                }
                if (sort == 'latest') {
                    res.json(response)
                } else if (sort == 'hottest') {

                }
            })
    } else {
        res.json({ success: false, error: 'Invalid page number.' })
    }
})

router.get('/search', async(req, res) => {
    if (req.query.page) {
        let skipIndex = (req.query.page - 1) * 20;
        let query = req.query.q
        let user = await User.findOne({ access_token: req.query.access_token })
        let response = {
            total_pages: 0,
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
        let postsPages = await Post.find({ $or: [{ title: { $regex: query, $options: "$i" } }, { content: { $regex: query, $options: "$i" } }] })
        response.total_pages = Math.ceil(postsPages.length / 20)
        let posts = await Post.find({ $or: [{ title: { $regex: query, $options: "$i" } }, { content: { $regex: query, $options: "$i" } }] }).sort({ date: -1 }).limit(20).skip(skipIndex)
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
                    if (String(upvote.user) == String(user._id)) {
                        responsePost.is_upvoted = true
                        return false
                    }
                    return true
                })
                user.saves.every(save => {
                    if (String(save) == String(posts[index]._id)) {
                        responsePost.is_saved = true
                        return false
                    }
                    return true
                })
            }
            let comments = await Comment.find({ details: { type: 'post', id: String(posts[index]._id) } })
            responsePost.comments = comments.length
            response.posts.push(responsePost)
        }
        res.json(response)
    } else {
        res.json({ success: false, error: 'Invalid page number.' })
    }
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
    let comments = await Comment.find({ details: { type: 'post', id: req.params.id } }).sort({ date: -1 })
    let responseComments = []
    for (let i = 0; i < comments.length; i++) {
        let commentAuthor = await User.findOne({ _id: comments[i].author })
        responseComments.push({
            comment: comments[i].comment,
            author_username: commentAuthor.username,
            author_pfp_url: commentAuthor.pfp_url,
            date: comments[i].date,
            id: comments[i]._id
        })
    }
    response.comments = responseComments
    res.json(response)
})

router.post('/new', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        req.body.title = DOMPurify.sanitize(req.body.title, { USE_PROFILES: { html: true } })
        req.body.content = DOMPurify.sanitize(req.body.content, { USE_PROFILES: { html: true } });
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

router.post('/comment/new', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let comment = new Comment({
            author: user._id,
            date: Date.now(),
            comment: req.body.comment,
            details: {
                type: 'post',
                id: req.body.post_id
            }
        })
        await comment.save()
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
            for (var i = post.upvotes.length - 1; i >= 0; --i) {
                if (String(post.upvotes[i].user) == String(user._id)) {
                    post.upvotes.splice(i, 1)
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

router.post('/save/:post_id', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let post = await Post.findOne({ _id: req.params.post_id })
        if (post) {
            user.saves.push(post._id)
            await User.findOneAndUpdate({ _id: user._id }, { saves: user.saves })
            res.json({ success: true })
        } else {
            res.json({ success: false, error: 'Post not found.' })
        }
    } else {
        res.json({ success: false, error: 'User not found.' })
    }
})

router.post('/unsave/:post_id', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let post = await Post.findOne({ _id: req.params.post_id })
        if (post) {
            for (let i = 0; i < user.saves.length; i++) {
                if (String(user.saves[i]) == String(req.params.post_id)) {
                    user.saves.splice(i, 1)
                    break
                }
            }
            await User.findOneAndUpdate({ _id: user._id }, { saves: user.saves })
            res.json({ success: true })
        } else {
            res.json({ success: false, error: 'Post not found.' })
        }
    } else {
        res.json({ success: false, error: 'User not found.' })
    }
})

router.post('/report/new', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let report = new Report({
            author: user._id,
            post: req.body.post_id,
            message: req.body.message
        })
        await report.save()
        res.json({ success: true })
    } else {
        res.json({ success: false, error: 'User not found.' })
    }
})

module.exports = router