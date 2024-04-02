const { connect, connection } = require('mongoose');

connect(process.env.MONGODB_URL).catch(err => {
	console.error('Failed to connect to the database', err);
	process.exit(1);
});

connection.on('connected', async () => {
	console.info('Successfully connected to the database');
});

connection.on('disconnected', () => {
	console.warn('MongoDB disconnected!');
});

connection.on('error', err => {
	console.error('MongoDB connection error:', err);
	process.exit(1);
});