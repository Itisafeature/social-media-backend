const express = require('express');

const postsController = require('../controllers/postsController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(postsController.getPosts)
  .post(postsController.createPost);

router
  .route('/:id')
  .get(postsController.getPost)
  .patch(postsController.updatePost)
  .delete(postsController.deletePost);

module.exports = router;
