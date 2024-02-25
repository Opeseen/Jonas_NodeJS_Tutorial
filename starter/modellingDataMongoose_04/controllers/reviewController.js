const {reviewService} = require('../services');
const catchAsyncError = require('../utils/catchAsyncError');
const httpStatus = require('http-status');

const getAllReviews = catchAsyncError(async(req, res) => {
  const reviews = await reviewService.getAllReviews();

  res.status(httpStatus.OK).json({
    status: 'Success',
    results: reviews.length,
    reviews
  });
});


const createReview = catchAsyncError(async(req, res) => {
  const reviewData = req.body;
  const newReview = await reviewService.createReview(reviewData);

  res.status(httpStatus.CREATED).json({
    status: 'Success',
    newReview
  });
});


module.exports = {
  getAllReviews,
  createReview
};
