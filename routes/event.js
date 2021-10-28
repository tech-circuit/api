const express = require('express')
const router = express.Router()
const Event = require('../models/Event')

router.get("/", async (req, res)=> {
    let events = await Event.find();
    res.send("events")
    // res.json(events);
})


module.exports = router;