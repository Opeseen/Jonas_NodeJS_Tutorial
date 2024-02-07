const userService = require('./userService');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const loginAuthSvc = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError('Incorrect email or password', httpStatus.UNAUTHORIZED);
  };
  return user;
};

module.exports = {
  loginAuthSvc,
};
