const catchAsyncError = require('../utils/catchAsyncError');
const { userService, tokenService, authService } =  require('../services');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const {sendEmail} = require('../utils/email');
const crypto = require('crypto');
const {User} = require('../models');

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
  // GENERATE TOKEN FOR USER WHEN LOGIN
  const token = tokenService.generateToken(user.id, process.env.JWT_EXPIRATION, process.env.JWT_SECRET)
  
  res.status(httpStatus.OK).json({user,token});

});


// HANDLER TO SEND PASSWORD RESET TOKEN TO USER EMAIL ADDRESS
const forgotPassword = catchAsyncError(async(req, res, next) =>{
  // GET USER BASED ON POSTED EMAIL
  const user = await userService.getUserByEmail(req.body.email);
  if(!user) {return next(new ApiError("No such user with the Email address on our records", httpStatus.NOT_FOUND))};

  // GENERATE RANDOM RESET TOKEN
  const resetToken = user.createPasswordresetToken();
  await user.save({validateBeforeSave: false});

  // SENd THE RESET TOKEN TO USER EMAIL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password\n Submit a PATCH request with your new password and password confirm to: ${resetUrl}\n
  If you didnt forgot your password - Please ignore this email.`

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token is valid for 10mins",
      message
    });

    res.status(200).json({
      status: "Success",
      message: "Token sent to email address provided"
    })
  } catch (error) {
    console.log(error)
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    // IF ERROR - THEN MAKE THE TOKEN UNDEFINED AND DISABLE VALIDATION
    await user.save({validateBeforeSave: false});

    return next(new ApiError("There was an error sending the email to the user. Please try again later",httpStatus.INTERNAL_SERVER_ERROR));
  };

});

// HANDLER TO FINALLY RESET THE USER PASSWORD
const resetPassword = async(req, res, next) => {
// 1) get the user based on the token
const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
const user = await User.findOne({
  passwordResetToken: hashedToken, 
  passwordResetTokenExpires: {$gt: Date.now() }
});
console.log(user)

// 2) If the token has not expired, and there is a user, then set th new user password

// 3) Update the passwordChangedAt property for the user

// 4) Log the user in, send JWT

};


module.exports = {
  signUpUser,
  login,
  forgotPassword,
  resetPassword
};