const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
	windowMs: 4 * 60 * 1000,
	limit: 6,
	standardHeaders: 'draft-7',
	legacyHeaders: false,

	skip: req => req.ip === '::ffff:127.0.0.1',

	message: { success: false, status: 429, message: 'Too many requests. Please try again later.' },
	statusCode: 429,
});