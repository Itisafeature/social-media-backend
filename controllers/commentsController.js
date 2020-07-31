const Post = require('../models/postModel');

exports.getComments = async (req, res, next) => {
  // TODO: Handle Error
  const post = await Post.findById(req.params.postId);
  //const comments = post.comments.map((el) => el).sort({ createdAt: -1 });
  if (post) {
    res.status(200).json({
      status: 'success',
      comment: post.comments,
    });
  } else {
    res.status(400).json({
      status: 'failed',
    });
  }
};

exports.createComment = async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  post.comments.push({ content: req.body.content, user: req.user });
  const comment = post.comments[post.comments.length - 1];
  await post.save();
  res.status(201).json({
    status: 'success',
    comment,
  });
};
