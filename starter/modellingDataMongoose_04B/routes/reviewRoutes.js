const express = require('express');
const { reviewController } = require('../controllers');
const {loginAuth, userRoleAuth} = require('../middlewares/auth');


const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(loginAuth, userRoleAuth('user'),reviewController.setTourAndUserId,reviewController.createReview)

router
  .route('/:id')
  .delete(loginAuth, userRoleAuth('user'), reviewController.deleteReview)
  .patch(loginAuth, userRoleAuth('user'), reviewController.updateReview);


module.exports = router;