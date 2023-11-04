const { set, connect, connection } = require('mongoose');
const prefix = '[mongoose]:';

set('strictQuery', true);

connect(process.env.MONGODB_URL);

connection.on('open', () => console.log(prefix, 'Successfully connected to the database'));
connection.on('close', () => console.log(prefix, 'Connection to the database has been closed'));
connection.on('reconnected', () => console.log(prefix, 'Successfully reconnected to the database'));
connection.on('disconnected', () => console.log(prefix, '------------------------------ Lost connection with the database ------------------------------'));
connection.on('error', err => console.error(prefix, 'An error occurred with the database!', err));

module.exports = connection;