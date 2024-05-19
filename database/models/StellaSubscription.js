const { Schema, model } = require('mongoose');

const StellaSubscription = new Schema({
	userId: { type: String, required: true, unique: true, index: true },
	email: {
		type: String,
		required: true,
		unique: true,
		index: true,
		lowercase: true,
		trim: true,
		match: [
			/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
			'Please fill a valid email address'
		]
	},
	benefitId: {
		type: Number,
		required: true,
		validate: {
			validator: Number.isInteger,
			message: '{VALUE} is not an integer'
		}
	},
	isActive: { type: Boolean, required: true, default: false },
	subscriptionDate: { type: Date },
	mirror: {
		selectedServer: { type: Number, default: 0, required: true },
		previousServer: { type: Number, default: null, required: true }
	}
}, { versionKey: false, timestamps: true });

module.exports = model('sm_subscriptions', StellaSubscription);