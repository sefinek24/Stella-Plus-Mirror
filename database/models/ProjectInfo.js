const { Schema, model } = require('mongoose');

const ProjectInfo = new Schema({
	stella: {
		// Stella versions
		versions: {
			launcher: {
				version: { type: String, default: '7.8.1.0' },
				beta: { type: Boolean, default: true },
				releaseDate: { type: Date, default: Date.now() },
			},
			resources: {
				version: { type: String, default: '1.2.2' },
				beta: { type: Boolean, default: false },
				releaseDate: { type: Date, default: Date.now() },
			},
			reshade: {
				version: { type: String, default: '5.9.2' },
				beta: { type: Boolean, default: false },
				releaseDate: { type: Date, default: Date.now() },
			},
			fpsUnlocker: {
				version: { type: String, default: '1.0.11' },
				beta: { type: Boolean, default: false },
				releaseDate: { type: Date, default: Date.now() },
			},
		},

		// For patrons
		patrons: {
			tier: {
				2: {
					version: { type: String, default: '2.8.4-alpha.0' },
					beta: { type: Boolean, default: false },
					releaseDate: { type: Date, default: Date.now() },
					resources:{
						migoto: { type: String, default: '0.2.3' },
						mods: { type: String, default: '0.2.2' },
						addons: { type: String, default: '0.2.5' },
						presets: { type: String, default: '0.2.0' },
						shaders: { type: String, default: '0.1.1' },
						cmd: { type: String, default: '0.2.1' },
					},
				},
				3: {
					version: { type: String, default: '2.8.4-alpha.0' },
					beta: { type: Boolean, default: false },
					releaseDate: { type: Date, default: Date.now() },
					resources:{
						migoto: { type: String, default: '0.2.3' },
						mods: { type: String, default: '0.2.2' },
						addons: { type: String, default: '0.2.5' },
						presets: { type: String, default: '0.2.0' },
						shaders: { type: String, default: '0.1.1' },
						cmd: { type: String, default: '0.2.1' },
					},
				},
			},

			mirrorId: { type: Number, default: 1 },
		},
	},
}, {
	timestamps: false,
	versionKey: false,
});

ProjectInfo
	.path('website')
	.validate(async function(value) {
		const exists = await this.constructor.exists({ website: value });
		return !exists;
	}, '\'Website\' must be unique');

module.exports = model('1_project-infos', ProjectInfo);