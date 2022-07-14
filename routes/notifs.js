const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Notification = require("../models/Notification");

router.get('/', async (req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token })
    let userID = user._id
    console.log(userID)
    let notifs = await Notification.find({ receiver: userID }).sort({ createdAt: -1 });
    // update notifs to be read
    for (let i = 0; i < notifs.length; i++) {
        notifs[i].read = true
        await notifs[i].save()
    }
    res.json({ notifs });
});

module.exports = router;