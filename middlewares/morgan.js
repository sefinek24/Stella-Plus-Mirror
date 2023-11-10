const morgan = require('morgan');

const logger = morgan('[:status :method :response-time ms] :url - :user-agent');

module.exports = logger;