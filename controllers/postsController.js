const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');

exports.getPosts = async (req, res, next) => {
  let posts;
  if (req.params.userId) {
    posts = await Post.find({ user: req.params.userId })
      .sort({ updatedAt: -1 })
      .select('-__v');
  } else {
    posts = await Post.find().sort({ updatedAt: -1 }).select('-__v'); // Not excluding __v
  }

  res.status(200).json({
    status: 'success',
    posts,
  });
};

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({
    content: req.body.content,
    user: req.user,
  });
  res.status(201).json({
    status: 'success',
    post,
  });
});

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'succes',
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      err: err['errors']['content']['properties']['message'],
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({
      status: 'error',
      err: err['errors']['content']['properties']['message'],
    });
  }
};
