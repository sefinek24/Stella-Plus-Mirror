const path = require('node:path');
const fs = require('node:fs');
const DeviceInfo = require('../../database/models/DeviceInfo.js');
const SubscriptionInfo = require('../../database/models/SubscriptionInfo.js');

const benefitsDir = path.join(__dirname, '..', '..', '..', 'cdn.sefinek.net', 'submodule', 'Stella-Mod-Resources', 'patrons');

module.exports.download = async (req, res) => {
	const user = req.user;
	const webToken = req.params.key;
	const db = await DeviceInfo.findOne({ devices: { $elemMatch: { 'secret.webToken': webToken } } });
	const subsInfo = await SubscriptionInfo.findOne({ userId: db.userId });
	const device = db.devices.find(doc => doc.secret.webToken === webToken);

	if (!device.status.active) return res.status(400).render('benefits/stella-mod-plus/received.ejs', { user, dir2Param: null, error: 'This url is not active rn.' });
	if (!device.status.verified || !device.status.captcha) return res.status(307).redirect(`/benefits/genshin-impact-reshade/receive/${user.id}/${device.secret.webToken}/captcha`);
	if (device.status.expired) return res.status(400).render('benefits/stella-mod-plus/received.ejs', { user, dir2Param: null, error: 'Url expired.' });
	if (device.status.received) return res.status(400).render('benefits/stella-mod-plus/received.ejs', { user, dir2Param: null, date: db.lastBenefitReceivedAt });

	const userMirror = subsInfo.mirror.selectedServer;
	if (userMirror !== 0) return res.send('Its not mirror 0!');

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