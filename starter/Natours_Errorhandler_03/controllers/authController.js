const catchAsyncError = require('../utils/catchAsyncError');
const { userService, tokenService, authService } =  require('../services');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const signUpUser = catchAsyncError(async (req, res) => {
  // CREATE A NEW USER
  const newUser = await userService.signUpUser(req.body);
  // GENERATE TOKEN FOR USER
  const token = tokenService.generateToken(newUser.id,process.env.JWT_EXPIRATION,process.env.JWT_SECRET)

  res.status(httpStatus.CREATED).json({
    status: 'Success',
    user: {newUser},
    token
  });
});


const login = catchAsyncError(async(req, res, next) => {
  const {email, password} = req.body;

  // CHECK IF EMAIL AND PASSWORD IS PROVIDED
  if(!email || !password) {return next(new ApiError('Please provide email and password',httpStatus.BAD_REQUEST))};
  
  // CHECK LOGIN CREDENTIALS
  const user = await authService.login(email, password);
  // GENERATE TOKEN FOR USER
  const token = tokenService.generateToken(User.id, process.env.JWT_EXPIRATION, process.env.JWT_SECRET)
  
  res.status(httpStatus.OK).json({user,token});

});


module.exports = {
  signUpUser,
  login
};