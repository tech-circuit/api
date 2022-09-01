const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const fields = require("../data/fields");

router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json({ success: true, projects: projects });
    } catch (err) {
        console.log(err);
        res.json({ success: false, error: err });
    }
});

router.get("/fields", (_, res) => {
    res.json({ success: true, fields });
});

router.get("user/:user", async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.user,
        });
        const projects = await Project.find({ uploader: user._id }).sort({
            createdAt: -1,
        });
        res.json({ projects });
    } catch (err) {
        console.log(err);
        res.json({ success: false, error: err });
    }
});

router.post("/add", async (req, res) => {
    const user = await User.findOne({ access_token: req.query.access_token });
    const {
        title,
        imgs,
        cover,
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
            imgs,
            cover,
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
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err });
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
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err });
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
        res.json({ success: true, project: project });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        await Project.deleteOne({ _id: req.params.id, uploader: user._id });
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});

router.post("/search", async (req, res) => {
    try {
        const field = req.body.field;

        if (field) {
            const projects = await Project.find({
                fields: req.body.field,
                $text: { $search: req.body.search },
            });

            return res.json({ success: true, projects: projects });
        }

        const projects = await Project.find({
            $text: { $search: req.body.search },
        });
        return res.json({ success: true, projects: projects });
    } catch (err) {
        return res.json({ success: false, error: err });
    }
});

router.post("/field", async (req, res) => {
    try {
        const projects = await Project.find({ fields: req.body.field });
        return res.json({ success: true, projects: projects });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
        });
        res.json({ success: true, project: project });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});

module.exports = router;
