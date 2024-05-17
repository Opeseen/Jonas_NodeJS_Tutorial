const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsyncError = require('../utils/catchAsyncError');
const { userService,handlerService } =  require('../services');
const { User } = require('../models');

// Middleware handler to out the current user ID into the request parameter
const getMe = (req,res,next) => {
  req.params.id = req.user.id;
  next()
};

const updateCurrentUserData = catchAsyncError(async(req, res, next) => {
  // Throw an error if user tries to update a password with this handler.
  if(req.body.password || req.body.passwordConfirm) { 
    return next(new ApiError('This route is not for password update. Please use the /updatePassword', httpStatus.BAD_REQUEST)); 
  };
  // Let the user to update his personal details
  const updatedUserDetails = await userService.updateCurrentUserData(req.body, req.user.id);

  return res.status(httpStatus.OK).json({
    status: "Success",
    updatedUserDetails
  });

});

const deleteMyUserData = catchAsyncError(async(req, res) => {
  // Delete the User data by setting the user to inactive 
  await userService.deleteMyUserData(req.user.id);

  res.status(httpStatus.NO_CONTENT).json({
    status: "Success",
    data: null
  });
});


const deleteUser = handlerService.deleteOneHandler(User);
const getUser = handlerService.getOneHandler(User);
const getAllUsers = handlerService.getAllHandler(User);


module.exports = {
  getMe,
  updateCurrentUserData,
  deleteMyUserData,
  deleteUser,
  getUser,
  getAllUsers
};