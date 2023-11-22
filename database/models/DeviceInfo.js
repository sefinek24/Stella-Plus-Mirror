const { Schema, model } = require('mongoose');

const DeviceSchema = new Schema({
	name: { type: String, default: 'My PC', required: true },
	reasons: { type: Array, default: [] },
	generatedKeyAt: { type: Date, default: Date.now() },
	status: {
		active: { type: Boolean, default: false },
		captcha: { type: Boolean, default: false },
		verified: { type: Boolean, default: false },
		received: { type: Boolean, default: false },
		expired: { type: Boolean, default: false },
	},
	secret: {
		webToken: {
			type: String,
			required: true,
			unique: true,
			sparse: true,
			index: true,
			validate: {
				validator: value => value.length === 256,
				message: 'Wrong webToken length',
			},
		},
		accessToken: {
			type: String,
			unique: true,
			sparse: true,
		},
		verifyKey: {
			type: String,
			unique: true,
			sparse: true,
			validate: {
				validator: value => value.length === 2048,
				message: 'Wrong verifyKey length',
			},
		},
	},
});

const MainSchema = new Schema({
	userId: { type: String, required: true, unique: true, index: true },
	benefitId: {
		type: Number,
		required: true,
		validate: {
			validator: Number.isInteger,
			message: '{VALUE} is not an integer',
		},
	},
	devices: {
		type: [DeviceSchema],
		default: [],
		validate: {
			validator: value => value.length < 3,
			message: 'Too many devices',
		},
	},
}, { versionKey: false });

module.exports = model('sm_benefits', MainSchema);