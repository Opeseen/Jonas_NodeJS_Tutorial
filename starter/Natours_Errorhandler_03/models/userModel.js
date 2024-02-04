const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const toJson = require('@meanie/mongoose-to-json');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    private: true
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(element) {
        return element === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: Date, // THIS IS WRITTEN MANUALLY ALONG WITH THE BODY WHEN SIGNING UP USER
  passwordResetToken: String,
  passwordResetTokenExpires: Date

});

userSchema.pre('save', async function(next){
  const user = this
  if(!user.isModified('password')) return next(); // ONLY RUN IF PASSWORD WAS MODIFIED

  user.password = await bcrypt.hash(user.password, 12);
  user.passwordConfirm = undefined;
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.methods.changedPasswordAfter = function(JWTtimestamp){
  const user = this;
  if(user.passwordChangedAt){
    const changeTimeStamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    return JWTtimestamp < changeTimeStamp; // TRUE MEANS PASSWORD HAS BEEN CHANGED
  };
  return false; // FALSE MEANS PASSWORD HAS NOT BEEN CHANGED
};

// GENERATE PASSWORD RESET TOKEN FOR USER
userSchema.methods.createPasswordresetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.plugin(toJson);

const User = mongoose.model('User', userSchema);

module.exports = User;