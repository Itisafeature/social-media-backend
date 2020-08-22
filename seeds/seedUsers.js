const User = require('../models/userModel');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const seedUsers = async () => {
  try {
    const data = await axios.get('https://randomuser.me/api/?results=20');
    for (const person of data['data']['results']) {
      await User.create({
        username: person['login']['username'],
        email: person['email'],
        image: person['picture']['thumbnail'],
        password: 'test1234',
        passwordConfirm: 'test1234',
      });
    }
  } catch (err) {
    console.log(err);
  }
};

seedUsers().then(() => mongoose.disconnect());
