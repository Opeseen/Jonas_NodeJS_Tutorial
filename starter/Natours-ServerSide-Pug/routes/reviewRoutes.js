const express = require('express');
const { reviewController } = require('../controllers');
const {loginAuth, userRoleAuth} = require('../middlewares/auth');


const router = express.Router({mergeParams: true});

router.use(loginAuth) // User needs to be authenticated before accessing the below routes.

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(userRoleAuth('user'),reviewController.setTourAndUserId,reviewController.createReview)

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(userRoleAuth('user','admin'), reviewController.deleteReview)
  .patch(userRoleAuth('user','admin'), reviewController.updateReview);


module.exports = router;