const router = require('express').Router();
const authController = require('../controllers/authController');

router
  .route('/auth')
  .get(authController.protect, authController.isAuthenticated);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

module.exports = router;
