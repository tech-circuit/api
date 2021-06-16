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

module.exports = router