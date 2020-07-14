const express = require('express');

const postRouter = require('./routes/postRoutes');

const app = express();
app.use(express.json());

app.use('/posts', postRouter);

module.exports = app;
