const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
// const fields = require('../data/fields')

router.get("/", async (req, res) => {
    const projects = await Project.find();
    res.json({ projects });
});

router.post("/add", async (req, res) => {
    const user = await User.findOne({ access_token: req.query.access_token });
    const {
        title,
        cover_image,
        description,
        fields,
        links,
        tags,
        event,
        collaborators,
    } = req.body;
    try {
        let project = new Project({
            title,
            cover_image,
            description,
            fields,
            links,
            uploader: user.username,
            tags,
            event,
            collaborators,
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

router.put("/edit/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        await Project.updateOne(
            { _id: req.params.id, uploader: user.username },
            { $set: req.body }
        );
        res.json({ done: true });
    } catch (err) {
        res.json({ err });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        const project = await Project.findOne({
            _id: req.params.id,
            uploader: user.username,
        });
        res.json({ project });
    } catch (err) {
        res.json({ err });
    }
});

module.exports = router;
