module.exports = {
	apps: [{
		name                  : 'mirror',
		script                : './index.js',

		log_date_format       : 'HH:mm:ss.SSS DD.MM.YYYY',
		merge_logs            : true,
		log_file		      : '/home/sefinek/logs/www/mirror.sefinek.net/combined.log',
		out_file              : '/home/sefinek/logs/www/mirror.sefinek.net/out.log',
		error_file            : '/home/sefinek/logs/www/mirror.sefinek.net/error.log',

		max_restarts          : 4,
		restart_delay         : 4000,
		wait_ready            : true,

		// instances             : 'max',
		// exec_mode             : 'cluster',
	}],
};