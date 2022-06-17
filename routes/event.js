const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");

router.get("/", async (req, res) => {
    let events = await Event.find().sort({ createdAt: -1 });
    res.json({ events });
});

router.post("/add", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });

        const {
            name,
            description,
            lastDate,
            host,
            eligibility,
            startDate,
            endDate,
            isIndependent,
            website,
            regLink,
            links,
            cover_image,
            email,
            phone,
            tags,
            institute,
            fields,
            country,
            state,
        } = req.body;

        let event = new Event({
            uploader: user._id,
            upload_date: new Date(),
            name,
            description,
            lastDate,
            host,
            eligibility,
            startDate,
            endDate,
            isIndependent,
            website,
            regLink,
            links,
            cover_image,
            email,
            phone,
            tags,
            institute,
            fields,
            country,
            state,
        });
        await event.save();
        res.json({ done: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false, error: err });
    }
});

router.get("/getForEdit/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        const event = await Event.findOne({
            _id: req.params.id,
            uploader: user._id,
        });
        res.json({ event });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});

router.put("/edit/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        await Event.updateOne(
            { _id: req.params.id, uploader: user._id },
            { $set: req.body }
        );
        res.json({ done: true });
    } catch (err) {
        res.json({ err });
    }
});

router.post("/search", async (req, res) => {
    try {
        const events = await Event.find({
            $text: { $search: req.body.search },
        });
        return res.json({ events });
    } catch (err) {
        return res.json({ err });
    }
});

router.post("/field", async (req, res) => {
    try {
        const events = await Event.find({ fields: req.body.field });
        return res.json({ events });
    } catch (err) {
        res.json({ err });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        await Event.deleteOne({ _id: req.params.id, uploader: user._id });
        res.json({ done: true });
    } catch (err) {
        res.json({ err });
    }
});

module.exports = router;
