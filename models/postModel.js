const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'A post must have some content'],
    minlength: [10, 'Minimum of ten characters required'],
  },
  likes: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Post must belong to a user'],
  },
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username',
  });
  next();
});

module.exports = mongoose.model('Post', postSchema);
