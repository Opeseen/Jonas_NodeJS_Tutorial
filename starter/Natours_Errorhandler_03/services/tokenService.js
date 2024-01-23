const jwt = require('jsonwebtoken');

// Function to generate Token
const generateToken = (userId, expires, secrets) => {
  const payload = {
      sub: userId,
      expires,
  };

  return jwt.sign(payload,secrets);
};


module.exports = {
  generateToken,
};