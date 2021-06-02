const express = require('express');
const router = express.Router();
const axios = require('axios')

router.post('/upload', (req, res) => {
    axios.post('https://api.imgur.com/3/upload', {
        image: req.body.b64,
        type: 'base64'
    }, {
        headers: {
            Authorization: `CLIENT-ID ${process.env.IMGUR_CLIENT_ID}`
        }
    }).then(response => {
        if (response.data.success == true) {
            res.json(response.data.data)
        } else {
            res.json(response.data)
        }
    })
});

module.exports = router