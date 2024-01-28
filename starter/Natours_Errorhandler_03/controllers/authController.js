const catchAsyncError = require('../utils/catchAsyncError');
const { userService, tokenService, authService } =  require('../services');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

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
  const token = tokenService.generateToken(user.id, process.env.JWT_EXPIRATION, process.env.JWT_SECRET)
  
  res.status(httpStatus.OK).json({user,token});

});


const forgotPassword = catchAsyncError(async(req, res, next) =>{
  // GET USER BASED ON POSTED EMAIL
  const user = await userService.getUserByEmail(req.body.email);
  if(!user) {return next(new ApiError("No such user with the Email address on our records", httpStatus.NOT_FOUND))};

  // GENERATE RANDOM RESET TOKEN
  const resetToken = user.createPasswordresetToken();
  await user.save({validateBeforeSave: false});
  res.status(httpStatus.OK).send('Success')
  // SENT THE RENDOM REST TOKEN AS AN EMAIL TO THE USER
});


const resetPassword = (req, res, next) => {

};


module.exports = {
  signUpUser,
  login,
  forgotPassword
};