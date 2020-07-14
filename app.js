const express = require('express');

const postRouter = require('./routes/postRoutes');

const app = express();

app.use('/posts', postRouter);

module.exports = app;
