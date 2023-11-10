const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const DownloadBenefitsController = require('../controllers/Stella-Mod-Plus/DownloadBenefits.js');

router.get('/benefits/genshin-impact-reshade/receive/:userId/:key/download', [
	param('userId')
		.isString()
		.isLength({ min: 5, max: 50 }),
	param('key')
		.isString(),
], DownloadBenefitsController.download);

module.exports = router;