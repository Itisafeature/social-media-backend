const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { create } = require('../models/userModel');

const createAndSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httponly: true,
    secure: true,
  };

  res.cookie('jwt', token, cookieOptions);

  // remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createAndSendToken(user, 201, res);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failed',
      err: err,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Not sure how to get rid of password
    const user = await User.findOne({ email }).select('+password');
    if (await user.correctPassword(password, user.password)) {
      createAndSendToken(user, 200, res);
    } else {
      res.status(401).json({
        status: 'failed',
        err: 'Invalid Credentials',
      });
    }
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      err: 'Invalid Credentials',
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
