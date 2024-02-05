const {User} = require('../models');

const signUpUser = async (userDetails) => {
  const {name, email, password, role, passwordConfirm, passwordChangedAt} = userDetails;
  const newUser = await User.create({name, email, password, role, passwordConfirm, passwordChangedAt});
  return newUser;
};

const getUserByEmail = async(email) => {
  return await User.findOne({email}).select('+password');
};

const getuserByID = async(id) => {
  const user = await User.findById(id);
  return user;
};

const confirmUserHashedTokenAndExpiration = async(hashedToken) => {
  const user = await User.findOne({
    passwordResetToken: hashedToken, 
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  return user;
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
  getuserByID,
  confirmUserHashedTokenAndExpiration,
  getUser,
  updateUser,
  deleteUser,
  getUserByEmail
};