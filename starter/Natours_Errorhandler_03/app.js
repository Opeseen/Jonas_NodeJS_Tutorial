const express = require('express');
const {errorHandler, pathNotFoundErrorHandler, errorConverter} = require('./middlewares/error');
const {limiter} = require('./middlewares/rateLimiter');
const {successLogHandler, errorLogHandler} = require('./config/morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// SET SECURITY HTTP HEADERS
app.use(helmet());

// 1) STATIC FILES AND BAODY PARSER, READING DATA FROM BODY INTO req.body
app.use(express.json( { limit: '10kb' } ));
// app.use(express.static(`${__dirname}/public`));

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XXX ATTACKS
app.use(xss());

// PREVENT PARAMETER POLLUTION
app.use(hpp({
  whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'difficulty', 'maxGroupSize', 'price']
}));

// RATE LIMITER MIDDLEWARES
app.use('', limiter)

// 2) ERROR LOGS
app.use(successLogHandler);
app.use(errorLogHandler);

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


// 4) ERROR HANDLER
app.use(pathNotFoundErrorHandler); // ERROR HANDLER FOR PATH NOT FOUND
app.use(errorConverter); // ERROR CONVERTER HANDLER
app.use(errorHandler); // ERROR HANDLER MIDDLEWARES


module.exports = app;
