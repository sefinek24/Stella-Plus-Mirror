const StellaPlusDevices = require('../../../../database/models/StellaPlusDevices');
const StellaSubscription = require('../../../../database/models/StellaSubscription');

module.exports = async userId => {
	const deviceInfo = await StellaPlusDevices.findOne({ userId });
	const subsData = await StellaSubscription.findOne({ userId });

	return { deviceInfo, subsData };
};