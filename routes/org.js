const express = require('express')
const router = express.Router()
const User = require('../models/User');
const Org = require('../models/Org');

router.get('/', (req, res) => {
    let orgs = Org.find();
    res.send("orgs")
    // res.json(orgs);
});

router.post('/add', (req, res) => {
    const user = User.findOne({ access_token: req.query.access_token })
    try {
        let org = new Org({
            name: req.body.name,
            institute: req.body.institute,
            isIndependant: req.body.isIndependant,
            description: req.body.description,
            website_url: req.body.website_url,
            links: req.body.links,
            members: req.body.members,
            upload_date: new Date(),
        })
        org.save()
    } catch (err) {
        res.json({ success: false, error: err })
    }
});

module.exports = router