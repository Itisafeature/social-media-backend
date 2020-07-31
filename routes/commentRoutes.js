const express = require('express');
const commentsController = require('../controllers/commentsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, commentsController.getComments)
  .post(authController.protect, commentsController.createComment);

module.exports = router;
