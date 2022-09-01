const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const randomstring = require("randomstring");
const axios = require("axios");
const nodemailer = require('nodemailer');

const User = require("../models/User");

// Mail Config
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'techcircuitcontact@gmail.com',
        pass: `${process.env.EMAIL_PASSWORD}`
    }
});

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
            let verification_token = randomstring.generate({
                length: 20
            })
            user.verify_token = verification_token
            await user.save()
            var mailOptions = {
                from: 'techcircuitcontact@gmail.com',
                to: `${req.body.email}`,
                subject: 'Verification Email',
                html: `<p>
                Hey ${req.body.firstname}, <br>
                Please verify your email address by clicking the link below: <br>
                <a href="https://api.techcircuit.co/user/verify/${verification_token}">Verify Email</a>
            </p>`
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    res.json({ success: false, error: error })
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ success: true, message: 'Verify your email address.' })
                }
            })
        } else {
            if (checkUser.google_id) {
              return res.json({ success: false, error: 'Please login with Google' })
            }
            if (!checkUser.verified) {
                const salt = await bcrypt.genSalt(10)
                const password = await bcrypt.hash(req.body.password, salt)
                checkUser.password = password;
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
    let user = null
    if (req.body.email.includes('@')) {
        user = await User.findOne({ email: req.body.email })
    } else {
        user = await User.findOne({ username: req.body.email })
    }
    if (user) {
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (validPassword) {
            if (!user.verified) {
                return res.status(400).json({ success: false, error: "Verify your email address." })
            }
            res.status(200).json({ success: true, user: user, message: "Valid password" });
        } else {
            res.status(400).json({ success: false, error: "Invalid Password" });
        }
    } else {
        res.status(400).json({ success: false, error: 'User does not exist.' })
    }
})

module.exports = router;
