const path = require('node:path');
const getSubscriberLauncher = require('./scripts/getSubscriberLauncher.js');
const sendValidationResult = require('./scripts/sendValidationResult.js');

const benefitsDir = process.env.NODE_ENV === 'production'
	? path.join(process.env.RESOURCES_REMOTE)
	: path.join(process.env.RESOURCES_LOCAL, 'benefits');

module.exports = async (req, res) => {
	const { error, subsData } = await getSubscriberLauncher(req, res);
	if (error) return;

	const { benefitType } = req.query;
	if (!benefitType || typeof benefitType !== 'string') {
		return sendValidationResult(req, res, { status: 400, type: 'dn', app: 'smp-mirror', deleteBenefits: false, deleteTokens: false, message: 'Bad request. Missing **benefitType**.' });
	}

	const thisMirrorId = parseInt(process.env.MIRROR_ID, 10);
	const userMirrorId = parseInt(subsData.mirror.selectedServer, 10);
	if (thisMirrorId !== userMirrorId) return sendValidationResult(req, res, { status: 400, type: 'dn', app: 'smp-mirror', deleteBenefits: false, deleteTokens: false, message: `Wrong mirror my friend. This: ${thisMirrorId}; Your: ${userMirrorId}` });

	if ([2].includes(subsData.benefitId)) {
		switch (benefitType) {
		case '3dmigoto-mods': return res.sendFile(benefitsDir + '/2/3DMigoto Mods.zip');
		case '3dmigoto': return res.sendFile(benefitsDir + '/3DMigoto.zip');
		case 'addons': return res.sendFile(benefitsDir + '/Addons.zip');
		case 'presets': return res.sendFile(benefitsDir + '/Presets.zip');
		case 'shaders': return res.sendFile(benefitsDir + '/Shaders.zip');
		case 'cmd': return res.sendFile(benefitsDir + '/cmd.zip');
		}
	}

	if ([3, 4, 5].includes(subsData.benefitId)) {
		switch (benefitType) {
		case '3dmigoto-mods': return res.sendFile(benefitsDir + '/3/3DMigoto Mods.zip');
		case '3dmigoto': return res.sendFile(benefitsDir + '/3DMigoto.zip');
		case 'addons': return res.sendFile(benefitsDir + '/Addons.zip');
		case 'presets': return res.sendFile(benefitsDir + '/Presets.zip');
		case 'shaders': return res.sendFile(benefitsDir + '/Shaders.zip');
		case 'cmd': return res.sendFile(benefitsDir + '/cmd.zip');
		}
	}

	return res.status(400).send({ success: false, status: 400, message: 'Unknown benefit.' });
};