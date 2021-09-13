const express = require('express')
const router = express.Router()
const emailCheck = require('email-validator')
const MailingListEmail = require('../models/MailingListEmail')

router.post('/subscribe', async(req, res) => {
    let check = await emailCheck.validate(req.body.email)
    if (check) {
        let alreadyExists = await MailingListEmail.findOne({ email: req.body.email })
        if (alreadyExists) {
            res.json({ success: false, message: 'Email address already subscribed.' })
        } else {
            let mailingListEmail = new MailingListEmail({
                email: req.body.email,
                date: Date.now()
            })
            try {
                await mailingListEmail.save()
                res.json({ success: true })
            } catch (err) {
                res.json({ success: false, message: err })
            }
        }
    } else {
        res.json({ success: false, message: 'Email address doesn\'t exist.' })
    }
});

router.get('/unsubscribe/:id', async(req, res) => {
    try {
        await MailingListEmail.deleteOne({ _id: req.params.id })
        res.json({ success: true })
    } catch (err) {
        res.json({ success: false, message: err })
    }
});

module.exports = router