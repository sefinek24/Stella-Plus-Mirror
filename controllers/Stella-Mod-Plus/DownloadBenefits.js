const fs = require('node:fs');
const { validationResult } = require('express-validator');
const sendResult = require('./scripts/sendResult.js');
const determineZipPath = require('./scripts/determineZipPath.js');
const DeviceInfo = require('../../database/models/DeviceInfo.js');
const SubscriptionInfo = require('../../database/models/SubscriptionInfo.js');

module.exports.download = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) throw { status: 400, message: errors.array() };

		const webToken = req.params.key;
		if (!webToken) throw { status: 400, message: 'Web token is invalid.' };

		const db = await DeviceInfo.findOne({ devices: { $elemMatch: { 'secret.webToken': webToken } } });
		if (!db) throw { status: 400, message: 'Device was not found.' };

		const device = db.devices.find(doc => doc.secret.webToken === webToken);
		if (!device.status.active) throw { status: 400, message: 'This link is no longer active.' };

		const userId = req.params.userId;
		if (!userId) throw { status: 400, message: 'User ID is invalid.' };
		if (!device.status.verified || !device.status.captcha) return res.status(307).redirect(`${process.env.PATRONS}/benefits/stella-mod-plus/receive/${userId}/${device.secret.webToken}/captcha`);
		if (device.status.expired) throw { status: 410, message: 'This URL has expired and will never be active again.' };
		if (device.status.received) throw { status: 400, message: 'Benefits were received.' };

		const subsInfo = await SubscriptionInfo.findOne({ userId });
		if (!subsInfo) throw { status: 405, message: 'Subscription data was not found.' };
		if (!subsInfo.isActive) throw { status: 402, message: 'Subscription is not active.' };

		// Check the mirror
		const userMirror = subsInfo.mirror.selectedServer.toString();
		if (userMirror !== process.env.MIRROR_ID) throw { status: 400, message: `It's not mirror ${process.env.MIRROR_ID}!` };

		// Get the zip path
		const zipPath = determineZipPath(db.benefitId);
		if (!zipPath) throw { status: 500, message: 'Unknown zip path.' };
		if (!fs.existsSync(zipPath)) throw { status: 500, message: 'File doesn\'t exist. Please report this error.' };

		// Update the database
		db.lastBenefitReceivedAt = Date.now();
		const deviceToUpdate = db.devices.find(doc => doc.secret.webToken === webToken);
		if (deviceToUpdate) deviceToUpdate.status.received = true;

		await db.save({ upsert: false, new: false, validateModifiedOnly: true, isNew: false });

		// Send file
		res.download(zipPath);

		// Final
		console.log(`Successfully served zip file for ${subsInfo.email}!`);
	} catch (err) {
		console.error('Failed to process download request.', err);
		sendResult(res, { status: err.status || 500, message: err.message || 'Internal Server Error' });
	}
};