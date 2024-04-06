const { Schema, model } = require('mongoose');

const DeviceSchema = new Schema({
	name: { type: String, default: 'My PC', required: true },
	generatedKeyAt: { type: Date },
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
		accessToken: { type: String, unique: true, sparse: true },
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
}, { timestamps: true });

const StellaPlusDevices = new Schema({
	userId: { type: String, required: true, unique: true, index: true },
	lastBenefitReceivedAt: { type: Date, default: null },
	devices: {
		type: [DeviceSchema],
		default: [],
		validate: {
			validator: value => value.length < 3,
			message: 'Too many devices',
		},
	},
}, { versionKey: false, timestamps: true });

module.exports = model('sm_plus-devices', StellaPlusDevices);