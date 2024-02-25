const express = require('express');
const { reviewController } = require('../controllers');
const {loginAuth, userRoleAuth} = require('../middlewares/auth');


const router = express.Router();

router
  .route('/')
  .get(loginAuth, userRoleAuth('user'),reviewController.getAllReviews)
  .post(reviewController.createReview);


module.exports = router;