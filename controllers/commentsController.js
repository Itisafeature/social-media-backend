const Post = require('../models/postModel');

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
