const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const randomstring = require("randomstring");
const axios = require("axios");

router.post('/signup', async(req, res) => {
    try {
        const checkUser = await User.findOne({ email: req.body.email });
        if (!checkUser) {
            const user = new User({
                username: req.body.username,
                given_name: req.body.firstname,
                last_name: req.body.lastname,
                name: `${req.body.firstname} ${req.body.lastname}`,
                email: req.body.email
            });
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
            user.access_token = randomstring.generate({
                length: 35
            })
            user.verify_token = randomstring.generate({
                length: 20
            })
            await user.save()
                // await call node mailer function that takes email, name and verify_email as parameters
            res.json({ success: true, message: 'Verify your email address.' })
        } else {
            if (!checkUser.pending_credentials.verified) {
                const salt = await bcrypt.genSalt(10)
                const password = await bcrypt.hash(req.body.password, salt)
                checkUser.pending_credentials = {
                    username: req.body.username,
                    verified: false,
                    password: password
                }
                await checkUser.save()
                res.json({ success: true, message: 'Verify your email address.' })
            } else {
                res.json({ success: false, error: 'Verify your email address.' })
            }
        }
    } catch (err) {
        res.json({ success: false, error: err })
    }
})

router.post('/login', async(req, res) => {
    const user = null
    if ('@' in req.body.username) {
        user = await User.findOne({ email: req.body.email, verified: true })
    } else {
        user = await User.findOne({ username: req.body.username, verified: true })
    }
    if (user) {
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (validPassword) {
            res.status(200).json({ success: true, user: user, message: "Valid password" });
        } else {
            res.status(400).json({ success: false, error: "Invalid Password" });
        }
    } else {
        res.status(400).json({ success: false, error: 'User does not exist.' })
    }
})

module.exports = router;