const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');

exports.getComments = catchAsync(async (req, res, next) => {
  // TODO: Handle Error
  const post = await Post.findById(req.params.postId);
  if (req.params.start * 1 > post.comments.length) {
  }
  // This is pure trash
  const comments = post.comments
    .map((el) => el)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(req.params.start * 1, req.params.start * 1 + 5);
  // console.log(comments);
  if (post) {
    res.status(200).json({
      status: 'success',
      comments,
    });
  }
});

exports.createComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  post.comments.push({ content: req.body.content, user: req.user });
  const comment = post.comments[post.comments.length - 1];
  await post.save({ timestamps: false });
  res.status(201).json({
    status: 'success',
    comment,
  });
});
