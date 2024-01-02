const timeout = require('express-timeout-handler');

module.exports = () => timeout.handler({
	timeout: 12000,
	onTimeout: (req, res) => res.status(503).send('503 ERROR'),
	disable: ['write', 'setHeaders', 'send', 'json', 'end'],
});