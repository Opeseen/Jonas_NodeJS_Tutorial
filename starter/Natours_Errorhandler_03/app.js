const express = require('express');
const morgan = require('morgan');
const {errorHandler, pathNotFoundErrorHandler, errorConverter} = require('./middlewares/error');
const {successLogHandler, errorLogHandler} = require('./config/morgan');

const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 2) STATIC FILES
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

// 3) ERROR LOGS
app.use(successLogHandler);
app.use(errorLogHandler);

// 4) ROUTES
app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);


// 5) ERROR HANDLER
app.use(pathNotFoundErrorHandler); // ERROR HANDLER FOR PATH NOT FOUND
app.use(errorConverter); // ERROR CONVERTER HANDLER
app.use(errorHandler); // ERROR HANDLER MIDDLEWARES


module.exports = app;
