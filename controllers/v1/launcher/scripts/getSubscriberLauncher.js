const jwt = require('jsonwebtoken');
const getDocumentByUserId = require('./getBenefitsDocument');
const sendValidationResult = require('./sendValidationResult.js');

module.exports = async (req, res) => {
	const authorizationHeader = req.headers.authorization;
	if (!authorizationHeader) {
		await sendValidationResult(req, res, { status: 500, type: 'get-subs', app: 'smp-mirror', deleteBenefits: true, deleteTokens: true, message: 'Missing authorization header.' });
		return { error: true };
	}

	const decodedToken = jwt.decode(authorizationHeader.substring(7));
	if (!decodedToken) {
		await sendValidationResult(req, res, { status: 500, type: 'get-subs', app: 'smp-mirror', deleteBenefits: true, deleteTokens: true, message: 'The provided token is not valid. It could not be decoded.' });
		return { error: true };
	}

	const { userId } = decodedToken;
	if (!userId || typeof userId !== 'string') {
		await sendValidationResult(req, res, { status: 500, type: 'get-subs', app: 'smp-mirror', deleteBenefits: true, deleteTokens: true, message: 'Missing **userId**.' });
		return { error: true };
	}

	const { deviceInfo, subsData } = await getDocumentByUserId(userId);
	if (!deviceInfo) {
		await sendValidationResult(req, res, { status: 500, type: 'get-subs', app: 'smp-mirror', deleteBenefits: true, deleteTokens: true, message: 'Database collection was not found.' });
		return { error: true };
	}

	console.log(`[getSubscriberLauncher]: Found ${deviceInfo.userId} in the database & and successfully decoded the jwt token`);

	return { error: false, deviceInfo, subsData };
};
