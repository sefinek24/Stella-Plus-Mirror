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

// Proxy
app.set('trust proxy', 1);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(timeout());
app.use(logger);


// Routes
app.use(SpeedTest);
app.use(Index);
app.use(Stella);


// Run the server
app.listen(process.env.PORT, () => {
	if (process.env.NODE_ENV === 'production') {
		try {
			process.send('ready');
		} catch (err) {
			// . . .
		}
	} else {
		console.log(`Mirror #${process.env.MIRROR_ID} is running on http://127.0.0.1:${process.env.PORT}`);
	}
});