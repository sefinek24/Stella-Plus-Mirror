require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Index = require('./routes/Index.js');

// MongoDB
require('./database/mongoose.js');

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(helmet({ crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: false, contentSecurityPolicy: false }));


// Routes
app.use(Index);


// Run server
app.listen(process.env.PORT, () => {
	if (process.env.NODE_ENV === 'production') {
		try {
			process.send('ready');
		} catch (err) {
			// . . .
		}
	} else {
		console.log(`Website https://patrons.sefinek.net is running on http://127.0.0.1:${process.env.PORT}`);
	}
});
