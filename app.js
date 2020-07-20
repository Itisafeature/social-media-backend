const express = require('express');
const cookieParser = require('cookie-parser');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use('/users', userRouter);
app.use('/posts', postRouter);

module.exports = app;
