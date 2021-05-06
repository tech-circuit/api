const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.get('/projects/:field', (req, res) => {
    Project.find({ fields: req.params.field }).sort({ upvotes: 'dsc' }).then(projects => {
        if (projects.length == 0) {
            res.sendStatus(404)
        } else {
            res.json(projects)
        }
    })
});

module.exports = router