const router = require('express').Router();
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const authController = require('../controllers/authController');
const postRouter = require('./postRoutes');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.username + '-' + '-0.jpg');
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.image = `${req.body.username}-${Date.now()}.jpeg`;

  await sharp(req.file.path)
    .resize(75, 75) // Crops image to this width and height
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/${req.body.image}`);

  req.body.image = `public/images/${req.body.image}`;

  next();
});

router
  .route('/auth')
  .get(authController.protect, authController.isAuthenticated);

router
  .route('/signup')
  .post(upload.single('image'), resizeUserPhoto, authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

router.use('/:userId/posts', postRouter);

module.exports = router;
