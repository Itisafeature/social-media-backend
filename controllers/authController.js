const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

const createAndSendToken = (user, statusCode, res) => {
  const expiration = Date.now() + 10 * 24 * 60 * 60 * 1000;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: expiration,
  });

  const cookieOptions = {
    expires: new Date(expiration),
    httponly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    expiration,
    user,
  });
};

// TODO: EMAIL VERIFICATION
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createAndSendToken(user, 201, res);
});

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
    expires: new Date(Date.now() + 10 * 1000), // TODO: Understand this
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  try {
    const token = await req.cookies.jwt;
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decodedToken.id);

    if (!token || !user) {
      return res.status(401).json({
        status: 'failed',
        err: 'Unauthorized',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: 'failed',
      err: 'Unauthorized',
    });
  }
};

exports.isAuthenticated = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
};
