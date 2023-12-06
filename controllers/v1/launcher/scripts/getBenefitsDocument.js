const StellaDevices = require('../../../../database/models/StellaDevices');
const StellaSubscription = require('../../../../database/models/StellaSubscription');

module.exports = async userId => {
	const deviceInfo = await StellaDevices.findOne({ userId });
	const subsData = await StellaSubscription.findOne({ userId });

	return { deviceInfo, subsData };
};