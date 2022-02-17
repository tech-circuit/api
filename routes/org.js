const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Org = require("../models/Org");

router.get("/", async (req, res) => {
    let orgs = await Org.find().sort({ createdAt: -1 });
    res.json({ orgs });
});

router.post("/add", async (req, res) => {
    const user = await User.findOne({ access_token: req.query.access_token });

    const admins = req.body.admins;
    admins.push(user._id);

    try {
        let org = new Org({
            name: req.body.name,
            institute: req.body.institute,
            isIndependant: req.body.isIndependant,
            description: req.body.description,
            website_url: req.body.website_url,
            links: req.body.links,
            members: req.body.members,
            logo_url: req.body.logo_url,
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
