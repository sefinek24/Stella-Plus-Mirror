const path = require('node:path');
const fs = require('node:fs');
const { validationResult } = require('express-validator');
const DeviceInfo = require('../../database/models/DeviceInfo.js');
const SubscriptionInfo = require('../../database/models/SubscriptionInfo.js');

const benefitsDir = process.env.NODE_ENV === 'production' ? process.env.RESOURCES_PATH : path.join(__dirname, '..', '..', '..', 'cdn.sefinek.net', 'submodule', 'Stella-Mod-Resources', 'patrons');

const sendResult = (res, data = {}) => {
	if (!data.status) data.status = 500;

	console.log(data);
	return res.status(data.status).type('json').send(JSON.stringify({ success: false, ...data }, null, 3));
};

module.exports.download = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return sendResult(res, { status: 400, message: errors.array() });

	const webToken = req.params.key;
	const db = await DeviceInfo.findOne({ devices: { $elemMatch: { 'secret.webToken': webToken } } });
	if (!db) return sendResult(res, { status: 400, message: 'Device was not found.' });

	const device = db.devices.find(doc => doc.secret.webToken === webToken);
	if (!device.status.active) return sendResult(res, { status: 400, message: 'This url is not active.' });

	const user = req.user;
	if (!device.status.verified || !device.status.captcha) return res.status(307).redirect(`${process.env.PATRONS}/benefits/genshin-impact-reshade/receive/${user.id}/${device.secret.webToken}/captcha`);
	if (device.status.expired) return sendResult(res, { status: 410, message: 'Url expired.' });
	if (device.status.received) return sendResult(res, { status: 400, message: 'Benefits was received.' });

	const subsInfo = await SubscriptionInfo.findOne({ userId: db.userId });
	if (!subsInfo) return sendResult(res, { status: 405, message: 'Subscription data was not found.' });
	if (!subsInfo.isActive) return sendResult(res, { status: 402, message: 'Subscription data was not found.' });

	const userMirror = subsInfo.mirror.selectedServer.toString();
	if (userMirror !== process.env.MIRROR_ID) return sendResult(res, { status: 400, message: 'Its not mirror ${process.env.MIRROR_ID}!' });


	let zipPath;
	switch (db.benefitId) {
	case 2:
		zipPath = path.join(benefitsDir, 'tier-2_favorite-kitten.zip');
		break;
	case 3: case 4: case 5:
		zipPath = path.join(benefitsDir, 'tier-3_trusted-cat.zip');
		break;
	default:
		sendResult(res, { status: 500, message: 'Unknown tier ID. Please report this issue on Discord.' });
		return null;
	}

	if (!zipPath) return;

	if (!fs.existsSync(zipPath)) {
		return sendResult(res, { status: 500, message: 'File doesn\'t exist. Please try again or report this.' });
	}

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

	res.download(zipPath);
};