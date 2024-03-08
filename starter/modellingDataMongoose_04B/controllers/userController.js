const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsyncError = require('../utils/catchAsyncError');
const { userService,handlerService } =  require('../services');
const { User } = require('../models');


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

const getAllUsers = catchAsyncError(async(req, res) => {
  // return all users from collection
  const allUsers = await userService.getAllUsers();
  res.status(httpStatus.OK).json({
    status: 'Success',
    result: allUsers.length,
    allUsers
  });
});


const deleteUser = handlerService.deleteOneHandler(User)



module.exports = {
  updateCurrentUserData,
  deleteMyUserData,
  getAllUsers,
  deleteUser
};