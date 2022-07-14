const express = require('express')
const router = express.Router()
const Project = require('../models/Project')

router.get('/projects/:field', (req, res) => {
    Project.find({ fields: req.params.field }).sort({ upload_date: -1 }).then(projects => {
        if (projects.length == 0) {
            res.sendStatus(404)
        } else {
            res.json({ success: true, projects: projects })
        }
    })
});

router.post('/comment/new', async(req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    if (user) {
        let comment = new Comment({
            author: user._id,
            date: Date.now(),
            comment: req.body.comment,
            details: {
                type: 'project',
                id: req.body.project_id
            }
        })
        await comment.save()
        res.json({ success: true })
    } else {
        res.json({ success: false, error: 'User not found.' })
    }
})

module.exports = router