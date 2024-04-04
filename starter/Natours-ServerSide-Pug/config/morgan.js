const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () => (process.env === 'production' ? ':remote-addr - ' : '');
const accessLogStreams =  fs.createWriteStream(path.join(__dirname, '..','logs/access.log'),{flags: 'a'});

const successLogFormat = `${getIpFormat()} :method :url :status :response-time ms :user-agent :date`;
const successLogHandler = morgan(successLogFormat, {stream: accessLogStreams, skip:(req, res) => res.statusCode >= 400 });

const errorLogFormat = `${getIpFormat()} :method :url :status :response-time ms :user-agent :date - error-message: :message`;
const errorLogHandler = morgan(errorLogFormat, {stream: accessLogStreams, skip:(req, res) => res.statusCode < 400});

module.exports = {successLogHandler, errorLogHandler};