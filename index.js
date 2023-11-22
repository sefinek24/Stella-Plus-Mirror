require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
require('./passport.js');
const timeout = require('./middlewares/timeout.js');
const logger = require('./middlewares/morgan.js');

// Routes
const Index = require('./routes/Index.js');
const PatronCenter = require('./routes/PatronCenter.js');
const API = require('./routes/v1.js');

// MongoDB
require('./database/mongoose.js');

// Create express app
const app = express();

// Proxy
app.set('trust proxy', 1);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(passport.initialize());
app.use(timeout());
app.use(express.static('public'));
app.use(logger);


// Routes
app.use(Index);
app.use('/api/v1', PatronCenter);
app.use('/api/v1', API);


// Run the server
app.listen(process.env.PORT, () => {
	if (process.env.NODE_ENV === 'production') {
		try {
			process.send('ready');
		} catch (err) {
			// . . .
		}
	}

	console.log(`Mirror #${process.env.MIRROR_ID} is running on http://127.0.0.1:${process.env.PORT}`);
});