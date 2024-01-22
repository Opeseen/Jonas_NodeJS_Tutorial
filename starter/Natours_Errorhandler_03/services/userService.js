const {User} = require('../models');

const signUpUser = async (userDetails) => {
  const newUser = await User.create(userDetails);
  return newUser;
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
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
};