const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');

const verifyToken = async (token, req, done) => {
	if (!token) {
		const message = 'Missing token.';
		console.warn(message);

		return done(null, false, { message });
	}

	try {
		const decoded = jwt.verify(token, process.env.SML_JWT_SECRET);

		console.log('============================ AUTHORIZED USER `mirror` ============================');

		return done(null, decoded);
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			console.log('JWT token expired');
			return done(null, false, { message: 'Token expired' });
		}

		console.error(err);
		return done(null, false, { message: 'Unauthorized' });
	}
};

passport.use('mirror', new BearerStrategy({ passReqToCallback: true }, (req, token, done) =>
	verifyToken(token, req, done),
));