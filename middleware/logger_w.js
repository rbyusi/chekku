const {createLogger, transports, format} = require('winston');
const { Timber } = require("@timberio/node");
const { TimberTransport } = require("@timberio/winston");
const { SumoLogic } = require('winston-sumologic-transport');
 

require('dotenv').config();
const options = {
    url: 'https://tisentat.herokuapp.com/'
  };
  
  winston.add(SumoLogic, options);
// Create a Timber client
const timber = new Timber(process.env.ENV_TIMBER_KEY, process.env.ENV_TIMBER_SOURCE_ID);

// const logger = createLogger({
//   transports: [
//     // new transports.Console({ 
//     //     level: 'debug', 
//     //     format: format.combine(format.timestamp(), format.json()) }),
//           // Create a Winston logger - passing in the Timber transport
//     new TimberTransport(timber)
//     ]
// });
const logger = createLogger({
    transports: [new TimberTransport(timber)]
  });


    logger.log({
        level: "info", // <-- will use Timber's `info` log level,
        format: format.combine(format.timestamp(), format.json()) });


//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new transports.Console({
//     format: format.combine(format.timestamp(), format.json()) 
//   }));
// }

module.exports = logger;