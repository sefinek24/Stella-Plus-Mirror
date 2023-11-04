const { Schema, model } = require('mongoose');

const MailHistorySchema = new Schema({
	from: { type: String, required: true },
	to: { type: String, required: true },
	title: { type: String, required: true },
	subject: { type: String, required: true },
	content: { type: String, required: true },
	date: { type: Date, required: true },
	status: { type: String, required: true },
});

const SubscriptionInfoSchema = new Schema({
	userId: { type: String, required: true, unique: true, index: true },
	benefitId: {
		type: Number,
		required: true,
		validate: {
			validator: Number.isInteger,
			message: '{VALUE} is not an integer',
		},
	},
	authProvider: {
		type: String,
		required: true,
		enum: ['discord', 'google'],
	},
	subscriptionType: {
		type: String,
		required: true,
		enum: ['patreon', 'stripe'],
	},
	discordAccountConnected: { type: Boolean },
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
	isActive: {
		type: Boolean,
		required: true,
		default: false,
	},
	stripe: {
		type: Object,
		required: false,

		customerId: {
			type: String,
			required: true,
			validate: {
				validator: async customerId => {
					const count = await this.model('SubscriptionInfo').countDocuments({ 'stripe.customerId': customerId });
					return !count;
				},
				message: 'Customer ID already exists',
			},
		},
		subscriptionId: {
			type: String,
			required: true,
			validate: {
				validator: async subscriptionId => {
					const count = await this.model('SubscriptionInfo').countDocuments({
						'stripe.subscriptionId': subscriptionId,
					});
					return !count;
				},
				message: 'Subscription ID already exists',
			},
		},
		priceId: {
			type: String,
			required: true,
		},
	},
	google: {
		type: Object,
		required: false,
		username: {
			type: String,
			required: true,
		},
	},
	discord: {
		type: Object,
		required: false,
		discordUserId: {
			type: String,
			required: true,
			validate: {
				validator: async discordUserId => {
					const count = await this.model('SubscriptionInfo').countDocuments({ 'discord.discordUserId': discordUserId });
					return !count;
				},
				message: 'Discord User ID already exists',
			},
		},
		username: {
			type: String,
			required: true,
		},
		global_name: {
			type: String,
			required: false,
		},
	},
	mirror: {
		type: Object,
		required: false,
		default: {},
		selectedServer: { type: Number, required: true },
		previousServer: { type: Number, required: true },
	},
	mails: {
		type: [MailHistorySchema],
		required: false,
		default: [],
	},
}, { versionKey: false });

module.exports = model('SubscriptionInfo', SubscriptionInfoSchema);