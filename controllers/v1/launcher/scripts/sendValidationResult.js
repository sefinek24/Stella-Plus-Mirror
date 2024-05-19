const StellaPlusDevices = require('../../../../database/models/StellaPlusDevices');

const prefix = '[sendValidationResult]:';

const removeTokens = async deviceDb => {
	const secrets = deviceDb.secret;
	if (!deviceDb || !secrets) {
		console.warn(prefix, 'Tokens cannot be deleted [1]; `deviceDb.secret` is unknown');
		return { deleted: false };
	}

	const webToken = secrets.webToken;
	if (!webToken) {
		console.warn(prefix, 'Tokens cannot be deleted [2]; `secrets.webToken` is unknown');
		return { deleted: false };
	}

	try {
		const db = await StellaPlusDevices.findOne({ devices: { $elemMatch: { 'secret.webToken': webToken } } });
		db.devices.map(doc => {
			if (doc.secret.webToken === webToken) {
				doc.status.active = false;
				doc.status.received = false;
				doc.status.expired = false;
				doc.status.captcha = false;
				doc.status.verified = false;
				doc.secret.accessToken = null;
				doc.secret.verifyKey = null;
				doc.secret.registryKey = null;
			}
		});

		await db.save({ validateBeforeSave: false, isNew: false });
	} catch (err) {
		console.error(err);
		return { deleted: false };
	}

	return { deleted: true };
};

module.exports = async (req, res, data = {}, deviceDb, subscriptionInfo) => {
	const { status, type, app, message } = data;
	let newKey = false;

	if (type === 'jwt' || type === 'jwt-sign') {
		newKey = false;
	} else if (type === 'db') {
		newKey = true;
	}

	const responseObj = {
		success: false,
		status,
		type,
		app,
		newKey,
		deleteBenefits: data.deleteBenefits,
		deleteTokens: data.deleteTokens,
		message
	};

	res.status(status).send(responseObj);

	if (deviceDb && data.deleteTokens) {
		const result = await removeTokens(deviceDb);
		if (!result.deleted) return;

		console.log(prefix, 'Deleted successfully all secret keys from the database for this user');
	}

	if (data.status >= 500) {
		console.error(prefix, `User: ${subscriptionInfo ? subscriptionInfo.userId : 'Unknown'}; Type: ${type}; App: ${app}; ${newKey ? 'The new key is required;' : ''} ${data}`);
	} else {
		console.log(prefix, `User: ${subscriptionInfo ? subscriptionInfo.userId : 'Unknown'}; Type: ${type}; App: ${app}; ${newKey ? 'The new key is required;' : ''} Message: ${message}`);
	}
};