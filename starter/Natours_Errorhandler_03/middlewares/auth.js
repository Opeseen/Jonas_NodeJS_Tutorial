const catchAsyncError = require('../utils/catchAsyncError');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');

const  loginAuth = catchAsyncError(async(req, res, next) => {
  let token;
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')){
    token = authorizationHeader.split(' ')[1];
  };

  if(!token) {return next(new ApiError('You are not login. Please login to get authorized', httpStatus.UNAUTHORIZED))};

  // VERIFY TOKEN
  const verifiedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(verifiedToken);

  next();

});



module.exports = {
  loginAuth
}