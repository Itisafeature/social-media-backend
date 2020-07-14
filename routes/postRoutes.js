const express = require('express');

const postsController = require('../controllers/postsController');

const router = express.Router();

router.route('/').get(postsController.getPosts);

module.exports = router;
