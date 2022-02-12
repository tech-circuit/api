const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Event = require('../models/Event')

router.get("/", async (req, res)=> {
    let events = await Event.find();
    res.send("events")
    // res.json(events);
})

router.post('/add', (req, res) => {
    const user = User.findOne({ access_token: req.query.access_token })
    try {
        let event = new Event({
            name: req.body.name,
            author: req.body.author,
            organisers: req.body.organisers,
            description: req.body.description,
            reg_last_date: req.body.reg_last_date,
            links: req.body.links,
            hosting_method: req.body.hosting_method,
            eligibility: req.body.eligibility,
            event_start_date: req.body.event_start_date,
            event_end_date: req.body.event_end_date,
            event_start_time: req.body.event_start_time,            
            event_end_time: req.body.event_end_time,            
            country: req.body.country,
            state: req.body.state,
            org: req.body.org,
            isIndependant: req.body.isIndependant,
            website: req.body.website,
            links: req.body.links,
            banner: req.body.banner,
            upload_date: new Date(),
            tags: req.body.tags,
            for_event: req.body.for_event
        })
        event.save()
    } catch (err) {
        res.json({ success: false, error: err })
    }
});

module.exports = router;