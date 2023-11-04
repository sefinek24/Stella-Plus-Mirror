const express = require('express');
const router = express.Router();
const DownloadBenefitsController = require('../controllers/Stella-Mod-Plus/DownloadBenefits.js');

const basePath = '/benefits/genshin-impact-reshade';
const logicBasePath = `${basePath}/receive/:userId/:key`;
router.get(`${logicBasePath}/download`, DownloadBenefitsController.download);

module.exports = router;