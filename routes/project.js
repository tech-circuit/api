const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const User = require('../models/User')
const fields = require('../data/fields')

router.post('/add', (req, res) => {
    const user = User.findOne({ access_token: req.query.access_token })
    try {
        let project = new Project({
            title: req.body.title,
            cover_image: req.body.cover_image,
            authors: req.body.authors,
            description: req.body.description,
            fields: req.body.fields,
            links: req.body.links,
            upload_date: new Date(),
            uploader: user.username,
            tags: req.body.tags,
            for_event: req.body.for_event
        })
        project.fields.forEach(field => {
            if (fields.design[field]) {
                if (!projects.fields.includes('design')) {
                    projects.fields.push('design')
                }
            } else if (fields.code[field]) {
                if (!projects.fields.includes('code')) {
                    projects.fields.push('code')
                }
            }
        })
        project.save()
    } catch (err) {
        res.json({ success: false, error: err })
    }
});

module.exports = router