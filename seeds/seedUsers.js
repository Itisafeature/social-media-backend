const User = require('../models/userModel');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

axios
  .get('https://randomuser.me/api/?results=20')
  .then((res) => res)
  .then((data) => {
    data['data']['results'].forEach((person) => {
      User.create({
        username: person['login']['username'],
        email: person['email'],
        image: person['picture']['thumbnail'],
        password: 'test1234',
        passwordConfirm: 'test1234',
      });
    });
  })
  .catch((err) => console.log(err));

mongoose.disconnect();
