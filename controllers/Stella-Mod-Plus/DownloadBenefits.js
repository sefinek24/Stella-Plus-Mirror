const fs = require('node:fs');
const { validationResult } = require('express-validator');
const sendResult = require('./scripts/sendResult.js');
const determineZipPath = require('./scripts/determineZipPath.js');
const DeviceInfo = require('../../database/models/DeviceInfo.js');
const SubscriptionInfo = require('../../database/models/SubscriptionInfo.js');

module.exports.download = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return sendResult(res, { status: 400, message: errors.array() });

	const webToken = req.params.key;
	if (!webToken) return sendResult(res, { status: 400, message: 'Web token is invalid.' });

	const db = await DeviceInfo.findOne({ devices: { $elemMatch: { 'secret.webToken': webToken } } });
	if (!db) return sendResult(res, { status: 400, message: 'Device was not found.' });

	// Get device
	const device = db.devices.find(doc => doc.secret.webToken === webToken);
	if (!device.status.active) return sendResult(res, { status: 400, message: 'This url is not active.' });

	// Check user
	const userId = req.params.userId;
	if (!userId) return sendResult(res, { status: 400, message: 'User id is invalid.' });
	if (!device.status.verified || !device.status.captcha) return res.status(307).redirect(`${process.env.PATRONS}/benefits/genshin-impact-reshade/receive/${userId}/${device.secret.webToken}/captcha`);
	if (device.status.expired) return sendResult(res, { status: 410, message: 'Url expired.' });
	if (device.status.received) return sendResult(res, { status: 400, message: 'Benefits was received.' });

	// Check the subscription status
	const subsInfo = await SubscriptionInfo.findOne({ userId });
	if (!subsInfo) return sendResult(res, { status: 405, message: 'Subscription data was not found.' });
	if (!subsInfo.isActive) return sendResult(res, { status: 402, message: 'Subscription data was not found.' });

	// Check mirror
	const userMirror = subsInfo.mirror.selectedServer.toString();
	if (userMirror !== process.env.MIRROR_ID) return sendResult(res, { status: 400, message: 'Its not mirror ${process.env.MIRROR_ID}!' });

	// Prepare zip
	const zipPath = determineZipPath(db.benefitId);
	if (!zipPath) return sendResult(res, { status: 500, message: 'Unknown tier ID. Please report this issue on Discord.' });
	if (!fs.existsSync(zipPath)) return sendResult(res, { status: 500, message: 'File doesn\'t exist. Please try again or report this.' });

	// Update the database
	try {
		db.lastBenefitReceivedAt = Date.now();
		db.devices.map(doc => {
			if (doc.secret.webToken === webToken) doc.status.received = true;
		});

		await db.save({ validateModifiedOnly: true, isNew: false });
	} catch (err) {
		console.error('Failed to update database record.', err);
		return sendResult(res, { status: 500, message: 'Database update error.' });
	}

	// Send file
	res.download(zipPath);
};