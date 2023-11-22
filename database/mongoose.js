const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL).then(() => {
	console.info('Connected to the database');
}).catch(err => {
	console.error('Failed to connect to the database', err);
	process.exit(1);
});

const db = mongoose.connection;
db.on('connected', () => console.info('MongoDB connected successfully!'));
db.on('disconnected', () => console.warn('MongoDB disconnected!'));
db.on('error', err => console.error('MongoDB connection error:', err));