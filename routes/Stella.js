const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const DownloadBenefitsController = require('../controllers/Stella-Mod-Plus/DownloadBenefits.js');

router.get('/benefits/stella-mod-plus/receive/:userId/:key/download', [
	param('userId')
		.notEmpty()
		.isString()
		.isLength({ min: 64, max: 64 }),
	param('key')
		.notEmpty()
		.isString()
		.isLength({ min: 256, max: 256 }),
], DownloadBenefitsController.download);

module.exports = router;