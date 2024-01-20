const express = require('express');
const morgan = require('morgan');
const {errorHandler, pathNotFoundErrorHandler, errorConverter} = require('./middlewares/error');

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

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);


// 4) ERROR
app.use(pathNotFoundErrorHandler); // ERROR HANDLER FOR PATH NOT FOUND
app.use(errorConverter);
app.use(errorHandler); // ERROR HANDLER MIDDLEWARES


module.exports = app;
