const catchAsyncError = require('../utils/catchAsyncError');
const { userService, tokenService, authService } =  require('../services');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const {sendEmail} = require('../utils/email');
const crypto = require('crypto');

// Function to send user a Token
const sendUserDetailsAndToken = (user, statusCode, res) => {
  // GENERATE TOKEN FOR THE USER
  const token = tokenService.generateToken(user.id,process.env.JWT_EXPIRATION,process.env.JWT_SECRET);
  res.status(statusCode).json({
    status: 'Success',
    user,
    token
  });
};

const signUpUser = catchAsyncError(async (req, res) => {
  // CREATE A NEW USER
  const newUser = await userService.signUpUser(req.body);
  // SEND TOKEN AND USER DETAILS
  sendUserDetailsAndToken(newUser, httpStatus.CREATED, res);
});


const loginUser = catchAsyncError(async(req, res, next) => {
  const {email, password} = req.body;

  // CHECK IF EMAIL AND PASSWORD IS PROVIDED
  if(!email || !password) {return next(new ApiError('Please provide email and password',httpStatus.BAD_REQUEST))};
  
  // CHECK LOGIN CREDENTIALS
  const user = await authService.loginAuthSvc(email, password);
  // SEND USER DETAILS AND TOKEN
  sendUserDetailsAndToken(user, httpStatus.OK, res);
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
    });
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
const resetPassword = catchAsyncError(async(req, res, next) => {
  // 1) get the user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await userService.confirmUserHashedTokenAndExpiration(hashedToken);

  // 2) If the token has not expired, and there is a user, then set th new user password
  if(!user) { return next(new ApiError('Token is Invalid or Expired', httpStatus.BAD_REQUEST)) };

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined; // DELETE THE PASSWORD RESET TOKEN
  user.passwordResetTokenExpires = undefined; // DELETE THE PASSWORD RESET TOKEN EXPIRES

  await user.save(); // SAVE THE USER NEW LOGIN DETAILS
  // LOGIN THE USER,SEND USER DETAILS AND TOKEN
  sendUserDetailsAndToken(user, httpStatus.OK, res);
});

const updateMyPassword = catchAsyncError (async(req, res, next) => {
  // Get the user from the collection
  const user = await userService.getUserByEmail(req.user.email);

  // 2) Check if the posted current password is correct
  if(!(await user.isPasswordMatch(req.body.currentPassword))) { return next(new ApiError('Your current password is wrong',httpStatus.UNAUTHORIZED)); };

  // 3) If So, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log the user in, anD send JWT
  sendUserDetailsAndToken(user, httpStatus.OK, res);
});


module.exports = {
  signUpUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateMyPassword
};