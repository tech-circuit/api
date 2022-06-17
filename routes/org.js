const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Org = require("../models/Org");

router.get("/", async (req, res) => {
    let orgs = await Org.find().sort({ createdAt: -1 });
    res.json({ orgs });
});

router.post("/add", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });

        const {
            name,
            institute,
            isIndependent,
            description,
            website_url,
            links,
            members,
            logo_url,
            admins,
            alumni,
        } = req.body;

        admins.push(user._id.toString());

        let org = new Org({
            name,
            institute,
            isIndependent,
            description,
            website_url,
            links,
            members,
            logo_url,
            admins,
            alumni,
        });

        await org.save();
        res.json({ done: true });
    } catch (err) {
        res.json({ done: false, error: err });
    }
});

router.get("/id/:id", async (req, res) => {
    let org = await Org.findOne({ _id: req.params.id });
    res.json({ org });
});

router.get("/getForEdit/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        const org = await Org.findOne({
            _id: req.params.id,
        });
        const verified = org.admins.find(
            (admin) => admin.toString() === user._id.toString()
        );

        if (verified) {
            return res.json({ org });
        } else {
            return res.json({ err: "User mismatch" });
        }
    } catch (err) {
        return res.json({ err });
    }
});

router.post("/search", async (req, res) => {
    try {
        const orgs = await Org.find({
            $text: { $search: req.body.search },
        });
        return res.json({ data: orgs });
    } catch (err) {
        return res.json({ err });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        const org = await Org.findOne({
            _id: req.params.id,
        });

        const verified = org.admins.find(
            (admin) => admin.toString() === user._id.toString()
        );

        if (verified) {
            await Org.deleteOne({ _id: req.params.id });
            return res.json({ done: true });
        } else {
            return res.json({ err: "User mismatch" });
        }
    } catch (err) {
        return res.json({ err });
    }
});

router.put("/edit/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });
        const org = await Org.findOne({
            _id: req.params.id,
        });
        const verified = org.admins.find(
            (admin) => admin.toString() === user._id.toString()
        );

        if (verified) {
            const adminPresent = req.body.admins.find(
                (admin) => admin.toString() === user._id.toString()
            );

            !adminPresent && req.body.admins.push(user._id.toString());

            await Org.updateOne({ _id: req.params.id }, { $set: req.body });
            return res.json({ done: true });
        }
    } catch (err) {
        res.json({ err });
    }
});

router.post("/req/:id", async (req, res) => {
    const user = await User.findOne({ access_token: req.query.access_token });

    const org = await Org.findById(req.params.id);
    let reqs = org.requests;

    if (reqs.includes(user._id.toString())) {
        res.json({ already: true });
    } else {
        reqs.push(user._id.toString());
        try {
            await Org.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        requests: reqs,
                    },
                }
            );

            res.json({ done: true });
        } catch (err) {
            res.json({ done: false, error: err });
        }
    }
});

module.exports = router;
