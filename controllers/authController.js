const jwt = require('jsonwebtoken');
const { promisfy } = require('util');
const User = require('../models/userModel');

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
    const user = await User.findOne({ email }).select('+password');
    await user.correctPassword(password, user.password);
    createAndSendToken(user, 200, res);
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

exports.protect = async (req, res, next) => {
  try {
    const token = await req.cookies.jwt;
    const decodedToken = await promisfy(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.id);
    if (!token || !user) {
      return res.status(401).json({
        status: 'failed',
        err: 'Unauthorized',
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'failed',
      err: 'Unauthorized',
    });
  }
};
