const crypto = require('node:crypto');

module.exports = () => {
	const token = crypto.randomBytes(64).toString('hex');
	const nonce = crypto.randomBytes(16).toString('hex');
	const timestamp = Math.floor(Date.now() / 1000);
	const dataToSign = `${token}.${nonce}.${timestamp}`;
	const signature = crypto.createHmac('sha256', process.env.HMAC_SECRET).update(dataToSign).digest('hex');
	const encodedTimestamp = Buffer.from(timestamp.toString()).toString('base64');
	return `${token}.${signature}.${nonce}.${encodedTimestamp}`;
};