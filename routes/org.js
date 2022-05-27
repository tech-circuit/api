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
            isIndependant,
            description,
            website_url,
            links,
            members,
            logo_url,
            admins,
        } = req.body;

        admins.push(user._id);

        let org = new Org({
            name,
            institute,
            isIndependant,
            description,
            website_url,
            links,
            members,
            logo_url,
            admins,
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
