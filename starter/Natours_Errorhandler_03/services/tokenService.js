const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

// Function to generate Token
const generateToken = (userId, expires, secrets) => {
  const payload = {
    sub: userId,
    exp: dayjs().add(expires,'days').unix(),
  };

  return jwt.sign(payload,secrets);
};


module.exports = {
  generateToken,
};