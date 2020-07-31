const express = require('express');

const postsController = require('../controllers/postsController');
const authController = require('../controllers/authController');
const commentRouter = require('./commentRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:postId/comments', commentRouter);

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
