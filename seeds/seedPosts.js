const Post = require('../models/postModel');
const User = require('../models/userModel');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Running'));

const seedPosts = async () => {
  const userCount = await User.countDocuments();
  const skip = 200;
  let comments = [];
  try {
    for (let i = 0; i < 3; i++) {
      const commentResults = await axios.get(
        `https://api.quotable.io/quotes?limit=50&skip=${
          300 + skip
        }&maxLength=250&minLength=5`
      );
      comments = comments.concat(commentResults.data.results);
    }
    const data = await axios.get(
      'https://api.quotable.io/quotes?limit=35&maxLength=250&minLength=10'
    );

    for (const post of data['data']['results']) {
      const randomUser = Math.floor(Math.random() * userCount);
      const user = await User.findOne().skip(randomUser);
      await Post.create({
        content: post.content,
        user: user,
      });
    }

    const postCount = await Post.countDocuments();

    for (const comment of comments) {
      const randomPost = Math.floor(Math.random() * postCount);
      const post = await Post.findOne().skip(randomPost);
      const randomCommenter = Math.floor(Math.random() * userCount);
      const commenter = await User.findOne().skip(randomCommenter);
      post.comments.push({ content: comment.content, user: commenter });
      await post.save();
    }
  } catch (err) {
    console.log(err);
  }
};

seedPosts().then(() => mongoose.disconnect());
