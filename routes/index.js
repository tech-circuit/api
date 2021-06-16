const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.redirect('https://github.com/tech-circuit/api')
});

module.exports = router