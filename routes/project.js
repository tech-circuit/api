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
        commentsEnabled,
    } = req.body;
    try {
        let project = new Project({
            title,
            cover_image,
            description,
            fields,
            links,
            uploader: user._id,
            tags,
            event,
            collaborators,
            commentsEnabled,
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
            { _id: req.params.id, uploader: user._id },
            { $set: req.body }
        );
        res.json({ done: true });
    } catch (err) {
        res.json({ err });
    }
});

router.get("/getForEdit/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        const project = await Project.findOne({
            _id: req.params.id,
            uploader: user._id.toString(),
        });
        res.json({ project });
    } catch (err) {
        res.json({ err });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        await Project.deleteOne({ _id: req.params.id, uploader: user._id });
        res.json({ done: true });
    } catch (err) {
        res.json({ err });
    }
});

router.post("/search", async (req, res) => {
    try {
        const projects = await Project.find({
            $text: { $search: req.body.search },
        });
        return res.json({ projects });
    } catch (err) {
        return res.json({ err });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
        });
        res.json({ project });
    } catch (err) {
        res.json({ err });
    }
});

module.exports = router;
