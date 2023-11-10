const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send(`<h1>Mirror #${process.env.MIRROR_ID}</h1>It works normal.`));

module.exports = router;