const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'A comment must have some content'],
      minlength: [5, 'Minimum of five characters required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'A post must have some content'],
      minlength: [10, 'Minimum of ten characters required'],
      maxlength: [250, 'Max length of 250 characters'],
    },
    likes: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Post must belong to a user'],
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username image',
  });
  next();
});

module.exports = mongoose.model('Post', postSchema);
