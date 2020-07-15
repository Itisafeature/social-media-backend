const mongoose = require('mongoose');
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
    minlength: [6, 'Password must be at least 6 characters'],
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

module.exports = mongoose.model('User', userSchema);
