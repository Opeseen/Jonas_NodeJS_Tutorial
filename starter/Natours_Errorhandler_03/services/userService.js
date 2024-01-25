const {User} = require('../models');

const signUpUser = async (userDetails) => {
  const {name, email, password, passwordConfirm, passwordChangedAt} = userDetails;
  const newUser = await User.create({name, email, password, passwordConfirm, passwordChangedAt});
  return newUser;
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

const getUserByEmail = async(email) => {
  return await User.findOne({email}).select('+password');
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};


module.exports = {
  signUpUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserByEmail
};