const { Schema, model } = require('mongoose');

const SubscriptionInfoSchema = new Schema({
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
			'Please fill a valid email address',
		],
	},
	subscriptionType: {
		type: String,
		required: true,
		default: 'stripe',
		enum: ['patreon', 'stripe'],
	},
	benefitId: {
		type: Number,
		required: true,
		validate: {
			validator: Number.isInteger,
			message: '{VALUE} is not an integer',
		},
	},
	isActive: {
		type: Boolean,
		required: true,
		default: false,
	},
	mirror: {
		type: Object,
		default: { selectedServer: 1, previousServer: null },

		selectedServer: { type: Number, default: 1, required: true },
		previousServer: { type: Number, default: null, required: true },
	},
}, { versionKey: false });

module.exports = model('SubscriptionInfo', SubscriptionInfoSchema);