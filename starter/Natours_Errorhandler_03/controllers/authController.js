const catchAsyncError = require('../utils/catchAsyncError');
const { userService } =  require('../services');
const httpStatus = require('http-status');

const signUpUser = catchAsyncError(async (req, res) => {
  // CREATE A NEW USER
  const newUser = await userService.signUpUser(req.body);
  res.status(httpStatus.CREATED).json({
    status: 'Success',
    user: {newUser}
  });

});


module.exports = {
  signUpUser,
}