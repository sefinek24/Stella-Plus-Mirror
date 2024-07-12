const axios = require('axios');
const fs = require('node:fs');
const { validationResult } = require('express-validator');
const generateSecret = require('../../utils/generateSecret.js');
const sendResult = require('./scripts/sendResult.js');
const determineZipPath = require('./scripts/determineZipPath.js');

const prefix = '[DownloadBenefits]:';

exports.download = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) throw { status: 400, message: errors.array() };

		const { webToken } = req.params;
		if (!webToken) throw { status: 400, message: 'Web token is invalid.' };

		const { userId } = req.params;
		if (!userId) throw { status: 400, message: 'User ID is invalid.' };

		// Secret key
		const secret = generateSecret();

		// Fetch device info from external API
		const deviceResponse = await axios.get(`${process.env.STELLA_API}/spc/device`, { headers: { 'X-Web-Token': webToken, 'X-Secret-Key': secret } });
		if (!deviceResponse.data) throw { status: 400, message: 'Device was not found.' };
		const device = deviceResponse.data;

		if (!device.status.active) throw { status: 403, message: 'This link is no longer active.' };

		if (!device.status.verified || !device.status.captcha) return res.status(307).redirect(`${process.env.PATRON_CENTER}/benefits/stella-mod-plus/receive/${userId}/${device.secret.webToken}/captcha`);
		if (device.status.expired) throw { status: 410, message: 'This URL has expired and will never be active again.' };
		if (device.status.received) throw { status: 403, message: 'Benefits were received.' };

		// Fetch subscription info from external API
		const subsResponse = await axios.get(`${process.env.STELLA_API}/spc/subscription`, { headers: { 'X-Web-Token': webToken, 'X-User-Id': userId, 'X-Secret-Key': secret } });
		if (!subsResponse.data) throw { status: 405, message: 'Subscription data was not found.' };
		const subsInfo = subsResponse.data;

		if (!subsInfo.isActive) throw { status: 402, message: 'Subscription is not active.' };

		// Check the mirror
		if (!subsInfo.mirror) throw { status: 500, message: 'Mirror data was not found.' };
		const userMirror = subsInfo.mirror.selectedServer.toString();
		if (userMirror !== process.env.MIRROR_ID) throw { status: 400, message: `The customer directed themselves to the incorrect mirror #${process.env.MIRROR_ID}! Your download server has the identifier #${userMirror}.` };

		// Get the zip path
		const zipPath = determineZipPath(subsInfo.benefitId);
		if (!zipPath) throw { status: 500, message: `Unknown zip path (${zipPath}) for benefit id ${subsInfo.benefitId}` };
		if (!fs.existsSync(zipPath)) throw { status: 500, message: 'File doesn\'t exist. Please report this error.' };

		// Update the device info via external API
		await axios.post(`${process.env.STELLA_API}/spc/device/update`, {
			webToken,
			status: { received: true },
			generatedKeyAt: new Date()
		}, { headers: { 'X-Secret-Key': secret } });


		// Send file
		res.download(zipPath);

		// Final
		console.log(prefix, `Successfully served zip file for ${subsInfo.email}`);
	} catch (err) {
		console.error(prefix, 'Failed to process download request.', err.response?.data || err.message);
		sendResult(res, { status: err.status || 500, message: err.message || 'Internal server error' });
	}
};