const express = require('express')
const router = express.Router()
const Org = require('../models/Org')

router.get('/', (req, res) => {
    let orgs = Org.find();
    res.send("orgs")
    // res.json(orgs);
});

module.exports = router