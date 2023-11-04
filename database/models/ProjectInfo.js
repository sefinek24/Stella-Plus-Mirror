const { Schema, model } = require('mongoose');

const ProjectInfo = new Schema({
	website: { type: String, default: 'sefinek.net', required: true, index: true, unique: true },
	me: {
		github: { type: String, default: '', unique: true },
		gravatar: { type: String, default: '', unique: true },
		discordId: { type: String, default: '', unique: true },
		twitter: { type: String, default: '', unique: true },
		instagram: { type: String, default: '', unique: true },
		line: { type: String, default: '', unique: true },
	},

	maintenance: {
		global: { type: Boolean, default: false },
		stella: { type: Boolean, default: false },
		allowOnly: { type: Array, default: ['::ffff:127.0.0.1'] },
	},

	stella: {
		downloads: {
			count: { type: Number, default: 0, validate: { validator: Number.isInteger, message: 'Count must be an integer' } },
			last: { type: Date, default: Date.now() },
			url: { type: String, default: 'https://github.com/sefinek24/Genshin-Impact-ReShade/releases/latest/download/Stella-Mod-Setup.exe' },
		},

		bans: { type: Array, default: [] },

		// Launcher
		launcher: {
			allow: { type: Boolean, default: true },
			reason: { type: String, default: '' },
		},

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

		// Update page
		updates: {
			url: { type: String, default: 'https://github.com/sefinek24/Genshin-Impact-ReShade/releases/latest/download/Stella-Mod-Setup.exe' },
			changelog: { type: String, default: 'https://github.com/sefinek24/Genshin-Impact-ReShade/wiki/14.-Changelog-for-v7.x.x' },
			allow: { type: Boolean, default: true },
		},

		// 0 = Null / 1 = All players / 2 = Only for patrons
		news: {
			webview: {
				url: { type: String, default: 'https://sefinek.net/genshin-stella-mod/webview/example' },
				for: { type: Number, default: 0 },
			},
			messagebox: {
				text: { type: String, default: 'Hello world!' },
				for: { type: Number, default: 1 },
			},
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