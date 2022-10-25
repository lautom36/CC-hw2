const consumerLogger = require('./consumerLogger');
let logger = null;

logger = consumerLogger();

module.exports = logger;