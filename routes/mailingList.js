const express = require('express')
const router = express.Router()
const MailingListEmail = require('../models/MailingListEmail')

router.post('/subscribe', async(req, res) => {
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