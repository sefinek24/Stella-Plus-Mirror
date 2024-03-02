const { connect, connection } = require('mongoose');

connect(process.env.MONGODB_URL).then(() => {
	console.info('Connected to the database');
}).catch(err => {
	console.error('Failed to connect to the database', err);
	process.exit(1);
});

connection.on('connected', () => console.info('MongoDB connected successfully!'));
connection.on('disconnected', () => console.warn('MongoDB disconnected!'));
connection.on('error', err => console.error('MongoDB connection error:', err));