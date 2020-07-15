const User = require('../models/userModel');

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
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
    await user.correctPassword(password, user.password);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      err: 'Invalid Credentials',
    });
  }
};
