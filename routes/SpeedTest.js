const express = require('express');
const router = express.Router();

router.head('/test/speedtest', (req, res) => res.sendStatus(200));

module.exports = router;