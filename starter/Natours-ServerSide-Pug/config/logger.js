const winston = require('winston');

const {format, createLogger, transports} = winston;
const {printf, timestamp, combine, uncolorize, colorize} = format;

const winstonLogformat = printf((obj) => {
  const {level, message, timestamp, stack} = obj;
  return `${timestamp}: ${level}: ${stack || message}`;
});
const logger = createLogger(
  {
    level: process.env === 'development' ? 'debug' : 'info',
    format: combine(timestamp(), winstonLogformat, process.env === 'development' ? colorize() : uncolorize()),
    transports: [new transports.Console()],
  }
);

module.exports = logger;