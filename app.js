const express = require('express');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/users', userRouter);
app.use('/posts', postRouter);

module.exports = app;
