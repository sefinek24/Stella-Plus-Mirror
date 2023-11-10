const { connect, connection } = require('mongoose');

connect(process.env.MONGODB_URL);

connection.on('open', () => console.log('Successfully connected to the database'));
connection.on('close', () => console.log('Connection to the database has been closed'));
connection.on('reconnected', () => console.log('Successfully reconnected to the database'));
connection.on('disconnected', () => console.log('------------------------------ Lost connection with the database ------------------------------'));
connection.on('error', err => console.error('An error occurred with the database!', err));