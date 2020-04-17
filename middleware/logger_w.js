const {createLogger, transports, format} = require('winston');
const { Timber } = require("@timberio/node");
const { TimberTransport } = require("@timberio/winston");
require('dotenv').config();

// Create a Timber client
const timber = new Timber(process.env.ENV_TIMBER_KEY, process.env.ENV_TIMBER_SOURCE_ID);

const logger = createLogger({
  transports: [
    new transports.Console({ 
        level: 'debug', 
        format: format.combine(format.timestamp(), format.json()) }),
          // Create a Winston logger - passing in the Timber transport
    new TimberTransport(timber)
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new transports.Console({
//     format: format.simple()
//   }));
// }

module.exports = logger;