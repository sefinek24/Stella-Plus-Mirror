const express = require('express');
const router = express.Router();
const DownloadBenefitsController = require('../controllers/Stella-Mod-Plus/DownloadBenefits.js');

router.get('/', (req, res) => res.send(`<h1>Mirror #${process.env.MIRROR_ID}</h1>It works normal.`));
router.get('/benefits/genshin-impact-reshade/receive/:userId/:key/download', DownloadBenefitsController.download);

module.exports = router;