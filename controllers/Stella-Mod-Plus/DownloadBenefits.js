const path = require('node:path');
const fs = require('node:fs');
const { validationResult } = require('express-validator');
const DeviceInfo = require('../../database/models/DeviceInfo.js');
const SubscriptionInfo = require('../../database/models/SubscriptionInfo.js');

const benefitsDir = process.env.NODE_ENV === 'production' ? process.env.RESOURCES_PATH : path.join(__dirname, '..', '..', '..', 'cdn.sefinek.net', 'submodule', 'Stella-Mod-Resources', 'patrons');

module.exports.download = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json(errors.array());

	const webToken = req.params.key;
	const db = await DeviceInfo.findOne({ devices: { $elemMatch: { 'secret.webToken': webToken } } });
	if (!db) return res.status(400).send('Device was not found.');

	const device = db.devices.find(doc => doc.secret.webToken === webToken);
	if (!device.status.active) res.status(400).send('This url is not active.');

	const user = req.user;
	if (!device.status.verified || !device.status.captcha) return res.status(307).redirect(`${process.env.PATRONS}/benefits/genshin-impact-reshade/receive/${user.id}/${device.secret.webToken}/captcha`);
	if (device.status.expired) return res.status(410).send('Url expired.');
	if (device.status.received) return res.status(400).send('Benefits was received.');

	const subsInfo = await SubscriptionInfo.findOne({ userId: db.userId });
	if (!subsInfo) return res.status(405).send('Subscription data was not found.');
	if (!subsInfo.isActive) return res.status(402).send('Your subscription is not active.');

	const userMirror = subsInfo.mirror.selectedServer.toString();
	if (userMirror !== process.env.MIRROR_ID) return res.status(400).send(`Its not mirror ${process.env.MIRROR_ID}!`);

	let zipPath;
	switch (db.benefitId) {
	case 2:
		zipPath = path.join(benefitsDir, 'tier-2_favorite-kitten.zip');
		break;
	case 3: case 4: case 5:
		zipPath = path.join(benefitsDir, 'tier-3_trusted-cat.zip');
		break;
	default:
		res.status(500).json({ success: false, status: 500, error: 'Unknown tier ID. Please report this issue on Discord.' });
		return console.error('Benefits.js: Unknown tier ID.', db.benefitId);
	}

	if (!fs.existsSync(zipPath)) {
		res.status(500).json({ success: false, status: 500, error: 'Error occurred. File doesn\'t exist. Please try again or report this.' });
		return console.error('Benefits.js: File was not found.', zipPath);
	}

	// Update the database
	db.lastBenefitReceivedAt = Date.now();
	db.devices.map(doc => {
		if (doc.secret.webToken === webToken) {
			doc.status.received = true;
		}
	});

	await db.save({ validateModifiedOnly: true, isNew: false });

	res.status(200).download(zipPath);
};