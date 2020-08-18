const express = require('express');
const commentsController = require('../controllers/commentsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/:start')
  .get(authController.protect, commentsController.getComments);

router
  .route('/')
  .post(authController.protect, commentsController.createComment);

module.exports = router;
