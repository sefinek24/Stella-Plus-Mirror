require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const timeout = require('./middlewares/timeout.js');
const logger = require('./middlewares/morgan.js');
const SpeedTest = require('./routes/SpeedTest.js');
const Index = require('./routes/Index.js');
const Stella = require('./routes/Stella.js');

// MongoDB
require('./database/mongoose.js');

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(helmet({ crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: false, contentSecurityPolicy: false }));
app.use(timeout());
app.use(express.static('public/static'));
app.use(logger);


// Routes
app.use(SpeedTest);
app.use(Index);
app.use(Stella);


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
