const express = require('express');

const postsController = require('../controllers/postsController');

const router = express.Router();

router
  .route('/')
  .get(postsController.getPosts)
  .post(postsController.createPost);

router
  .route('/:id')
  .get(postsController.getPost)
  .patch(postsController.updatePost);

module.exports = router;
