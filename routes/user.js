const express = require('express')
const router = express.Router()
const axios = require('axios')
const User = require('../models/User')

const DISCORD_CLIENT_ID = '830041863247495168'

router.post('/gauth', (req, res) => {
    try {
        User.findOne({ google_id: req.body.googleId }).then((user) => {
            if (!user) {
                let username = req.body.email.split('@')[0]
                req.body.imageUrl = req.body.imageUrl.slice(0, -4)
                req.body.imageUrl = `${req.body.imageUrl}1000-c`
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
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }
});

router.get('/discordauth', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}%2Fuser%2Fdiscordauth%2Fcallback&response_type=code&scope=identify&state=${req.query.access_token}`)
})

router.get('/discordauth/callback', async(req, res) => {
    try {
        const code = req.query.code
        const access_token = req.query.state
        let response = await axios.post('https://discord.com/api/oauth2/token', `client_id=${DISCORD_CLIENT_ID}&client_secret=${process.env.DISCORD_CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${process.env.BASE_URL}/user/discordauth/callback&scopes=identify`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(err => {
            console.log(err)
        })
        User.findOne({ access_token: access_token }).then(async(user) => {
            if (user) {
                user.discord_auth = response.data
                let discord_user = await axios.get('https://discord.com/api/users/@me', { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${response.data.access_token}` } })
                if (!user.socials) {
                    user.socials = {}
                }
                user.socials.discord = discord_user.data
                user.save()
                res.sendStatus(200)
            } else {
                res.sendStatus(404)
            }
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router