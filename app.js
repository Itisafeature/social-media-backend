const express = require('express');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.use(globalErrorHandler);

module.exports = app;
