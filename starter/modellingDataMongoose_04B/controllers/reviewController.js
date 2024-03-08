const {reviewService} = require('../services');
const catchAsyncError = require('../utils/catchAsyncError');
const httpStatus = require('http-status');
const {deleteHandler} = require('./factoryHandler');

const getAllReviews = catchAsyncError(async(req, res) => {
  let filter = {};
  if(req.params.tourId) filter = {tour: req.params.tourId};
  const reviews = await reviewService.getAllReviews(filter);

  res.status(httpStatus.OK).json({
    status: 'Success',
    results: reviews.length,
    reviews
  });
});


const createReview = catchAsyncError(async(req, res) => {
  if(!req.body.tour) {req.body.tour = req.params.tourId}; // GET THE TOUR ID IF NOT INCLUDED IN THE REQUEST BODY
  if(!req.body.user) {req.body.user = req.user.id}; // GET THE USER ID FROM THE LOGIN AUTH MIDDLEWARE IF NOT IN THE REQUEST BODY

  const reviewData = req.body;
  const newReview = await reviewService.createReview(reviewData);

  res.status(httpStatus.CREATED).json({
    status: 'Success',
    newReview
  });
});

const deleteReview = deleteHandler(reviewService)


module.exports = {
  getAllReviews,
  createReview,
  deleteReview
};
