const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Must have username'],
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Email can't be blank"],
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Must have a password'],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
