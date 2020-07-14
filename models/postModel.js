const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'A post must have a duration'],
    minlength: [10, 'Minimum of ten characters required'],
  },
  likes: Number,
});

module.exports = mongoose.model('Post', postSchema);
