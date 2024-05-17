const catchAsyncError = require('../utils/catchAsyncError');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const {User} = require('../models');


const  loginAuth = catchAsyncError(async(req, res, next) => {
  let token;
  const authorizationHeader = req.headers.authorization; // GET THE TOKEN FROM THE HEADER
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')){
    token = authorizationHeader.split(' ')[1];
  }else if(req.cookies.jwt){
    token = req.cookies.jwt;
  }

  if(!token) {return next(new ApiError('You are not login. Please login to get authorized', httpStatus.UNAUTHORIZED))};

  // VERIFY TOKEN
  const verifiedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

// CHECK IF THE USERR STILL EXISTS USING THE JWT SUBJECT
  const currentUser = await User.findById(verifiedToken.sub);
  if(!currentUser) {return next(new ApiError('Oops!: The user no longer exists', httpStatus.UNAUTHORIZED))};

  // CHECK IF USER CHANGE PASSWORD AFTER THE TOKEN WAS ISSUED
  if(currentUser.changedPasswordAfter(verifiedToken.iat)) {return next(new ApiError('Oops!: User recently changed his password - Please login again', httpStatus.UNAUTHORIZED))};

  req.user = currentUser;
  next();

});

const  IsloginAuth = catchAsyncError(async(req, res, next) => {
  const token = req.cookies.jwt;
  if(token){
    // VERIFY TOKEN
    const verifiedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // CHECK IF THE USERR STILL EXISTS USING THE JWT SUBJECT
    const currentUser = await User.findById(verifiedToken.sub);
    if(!currentUser) {return next()};
  
    // CHECK IF USER CHANGE PASSWORD AFTER THE TOKEN WAS ISSUED
    if(currentUser.changedPasswordAfter(verifiedToken.iat)) {return next()};
  
    // THERE IS A LOGIN USER
    res.locals.user = currentUser;
    return next();
  };
  next();
 
});

const userRoleAuth = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      return next(new ApiError('You do not have permission to perform this activity', httpStatus.FORBIDDEN));
    };

    next();
  };

};



module.exports = {
  loginAuth,
  userRoleAuth,
  IsloginAuth
};