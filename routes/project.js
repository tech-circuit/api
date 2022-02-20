const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
// const fields = require('../data/fields')

router.post("/add", async (req, res) => {
    const user = await User.findOne({ access_token: req.query.access_token });
    try {
        let project = new Project({
            title: req.body.title,
            cover_image: req.body.cover_image,
            authors: req.body.authors,
            description: req.body.description,
            fields: req.body.fields,
            links: req.body.links,
            uploader: user.username,
            tags: req.body.tags,
            event: req.body.event,
        });
        // project.fields.forEach(field => {
        //     if (fields.design[field]) {
        //         if (!projects.fields.includes('design')) {
        //             projects.fields.push('design')
        //         }
        //     } else if (fields.code[field]) {
        //         if (!projects.fields.includes('code')) {
        //             projects.fields.push('code')
        //         }
        //     }
        // })
        await project.save();
        res.json({ done: true });
    } catch (err) {
        res.json({ err });
    }
});

module.exports = router;
