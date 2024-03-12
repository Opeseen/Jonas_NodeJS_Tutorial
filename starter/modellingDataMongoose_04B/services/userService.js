const {User} = require('../models');

const signUpUser = async (userDetails) => {
  const {name, email, password, role, passwordConfirm, passwordChangedAt} = userDetails;
  const newUser = await User.create({name, email, password, role, passwordConfirm, passwordChangedAt});
  return newUser;
};

const getUserByEmail = async(email) => {
  return await User.findOne({email}).select('+password');
};

const confirmUserHashedTokenAndExpiration = async(hashedToken) => {
  const user = await User.findOne({
    passwordResetToken: hashedToken, 
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  return user;
};

const updateCurrentUserData = async (updatedUserDetails, userId) => {

  const {email, name} = updatedUserDetails;
  const updatedUser = await User.findByIdAndUpdate(userId, {email, name}, {
    new: true,
    runValidators: true
  });

  return updatedUser;
};

const deleteMyUserData = async(userId) => {
  // Let the user delete his personal data
  await User.findByIdAndUpdate(userId, {active: false});
};

const getAllUsers = async() => {
  const allUser = await User.find();
  return allUser;
};



module.exports = {
  signUpUser,
  getUserByEmail,
  confirmUserHashedTokenAndExpiration,
  updateCurrentUserData,
  deleteMyUserData,
  getAllUsers,
};