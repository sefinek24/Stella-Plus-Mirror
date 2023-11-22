module.exports = (res, data = {}) => {
	if (!data.status) data.status = 500;

	return res.status(data.status).type('json').send(JSON.stringify({ success: false, ...data }, null, 3));
};