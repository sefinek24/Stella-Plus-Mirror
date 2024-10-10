require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
require('./passport.js');
const timeout = require('./middlewares/timeout.js');
const logger = require('./middlewares/morgan.js');
const { version } = require('./package.json');

// Routes
const Index = require('./routes/Index.js');
const PatronCenter = require('./routes/PatronCenter.js');
const API = require('./routes/v1.js');

// Axios instance
const axios = require('axios');
axios.defaults.timeout = 14000;
axios.defaults.headers.common['User-Agent'] = `Mozilla/5.0 (compatible; StellaMirror${process.env.MIRROR_ID}/${version}; +https://stella.sefinek.net)`;

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
			console.error('Error sending ready signal to parent process.', err.message);
		}
	}

	console.log(`Mirror #${process.env.MIRROR_ID} is running on http://127.0.0.1:${process.env.PORT}`);
});