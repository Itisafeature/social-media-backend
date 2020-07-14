const Post = require('../models/postModel');

exports.getPosts = async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    status: 'success',
    data: {
      posts,
    },
  });
};

exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      err,
    });
  }
};
