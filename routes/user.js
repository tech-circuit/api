const express = require('express');
const router = express.Router();
const User = require('../models/User')

router.post('/gauth', (req, res) => {
    try {
        User.findOne({ email: req.body.email }).then((user) => {
            if (!user) {
                username = req.body.email.split('@')[0]
                let newUser = User({
                    email: req.body.email,
                    name: req.body.name,
                    given_name: req.body.givenName,
                    family_name: req.body.familyName,
                    google_id: req.body.googleId,
                    pfp_url: req.body.imageUrl,
                    access_token: req.body.access_token,
                    username: username
                })
                newUser.save()
            } else {
                user.access_token = req.body.access_token
                user.save()
            }
        })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router