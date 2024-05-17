const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const errorConverter = (err, req, res, next) => {
  let error = err;
  // console.error(error.name)
  // console.log(error)
  let message;

  if(!(error instanceof ApiError)){
    let statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;

    if(error.name === 'CastError') { message = `Invalid ${error.path} : ${error.value} provided` };
    if(error.code === 11000) { message = `Duplicate Field: "${Object.values(error.keyValue)[0]}" already exists`, statusCode = httpStatus.BAD_REQUEST };
    if(error.name === 'ValidationError') { message = Object.values(error.errors).map(element => element.message).join('. ') };
    if(error.name === 'JsonWebTokenError') { return next(new ApiError('Invalid token. Please login again', httpStatus.UNAUTHORIZED)) };
    if(error.name === 'TokenExpiredError') { return next(new ApiError('Your Token has expired - Please login again', httpStatus.UNAUTHORIZED)) };
    
    error = new ApiError(message || error.message, statusCode);

  };
  next(error);
};

const pathNotFoundErrorHandler = (req, res, next) => {
  const statusCode = httpStatus.NOT_FOUND;
  next(new ApiError(`The requested url ${req.originalUrl} is ${httpStatus[statusCode]}`, httpStatus.NOT_FOUND));
};

const errorHandler = (err, req, res, next) => {
  let {message, statusCode} = err;
  const response = {
    error: true,
    status: `${statusCode}`.startsWith('4') ? 'FAILED' : 'ERROR',
    code: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message,
    ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
  };
  
  res.locals.errorMessage = message;
  res.status(statusCode).send(response);
};


module.exports = {
  errorHandler,
  pathNotFoundErrorHandler,
  errorConverter,
};