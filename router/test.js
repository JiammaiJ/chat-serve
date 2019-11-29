const express = require('express')
const Test = require('../db/test')
const router = express.Router('../db/test.js');

router.post('/test',(req,res) => {
    console.log(req.body);
    res.send('111');
})

module.exports = router;