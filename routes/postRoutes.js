const express = require('express');

const postsController = require('../controllers/postsController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, postsController.getPosts)
  .post(authController.protect, postsController.createPost);

router
  .route('/:id')
  .get(authController.protect, postsController.getPost)
  .patch(authController.protect, postsController.updatePost)
  .delete(authController.protect, postsController.deletePost);

module.exports = router;
