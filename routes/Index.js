const express = require('express');
const router = express.Router();
const DownloadBenefitsController = require('../controllers/Stella-Mod-Plus/DownloadBenefits.js');

router.get('/', (req, res) => res.send(`<h1>Mirror #${process.env.MIRROR_ID}</h1>It works normal.`));

const basePath = '/benefits/genshin-impact-reshade';
const logicBasePath = `${basePath}/receive/:userId/:key`;
router.get(`${logicBasePath}/download`, DownloadBenefitsController.download);

module.exports = router;