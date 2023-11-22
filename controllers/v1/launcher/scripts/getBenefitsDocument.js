const DeviceInfo = require('../../../../database/models/DeviceInfo');
const SubscriptionInfo = require('../../../../database/models/SubscriptionInfo');

module.exports = async userId => {
	const deviceInfo = await DeviceInfo.findOne({ userId });
	const subscriptionData = await SubscriptionInfo.findOne({ userId });

	return { deviceInfo, subscriptionData };
};