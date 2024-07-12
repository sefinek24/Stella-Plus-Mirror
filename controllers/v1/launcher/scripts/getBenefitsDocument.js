const axios = require('axios');
const generateSecret = require('../../../../utils/generateSecret');

module.exports = async userId => {
	try {
		const res = await axios.get(`${process.env.EXTERNAL_API_URL}/launcher/data`, { headers: { 'X-User-Id': userId, 'X-Secret-Key': generateSecret() } });
		return { subsData: res.data.user, deviceInfo: res.data.device };
	} catch (err) {
		console.error('Error fetching user and device information:', err.response?.data || err.message);
		return { subsData: null, deviceInfo: null };
	}
};