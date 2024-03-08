const catchAsyncError = require('../utils/catchAsyncError');
const httpStatus = require('http-status');
const {reviewService} = require('../services');
const { handlerService } =  require('../services');
const { Review } = require('../models');

const setTourAndUserId = (req, res, next) => {
  if(!req.body.tour) {req.body.tour = req.params.tourId}; // GET THE TOUR ID IF NOT INCLUDED IN THE REQUEST BODY
  if(!req.body.user) {req.body.user = req.user.id}; // GET THE USER ID FROM THE LOGIN AUTH MIDDLEWARE IF NOT IN THE REQUEST BODY

  next();
};

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


const createReview = handlerService.createOneHandler(Review);
const deleteReview = handlerService.deleteOneHandler(Review);
const updateReview = handlerService.updateOneHandler(Review);


module.exports = {
  setTourAndUserId,
  getAllReviews,
  createReview,
  deleteReview,
  updateReview
};
