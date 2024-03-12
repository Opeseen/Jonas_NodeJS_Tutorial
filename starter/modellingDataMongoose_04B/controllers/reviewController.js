const { handlerService } =  require('../services');
const { Review } = require('../models');

// GLOBAL HANDLER MIDDLEWARE TO SET THE TOUR AND USER ID IF NOT GICEN 
const setTourAndUserId = (req, res, next) => {
  if(!req.body.tour) {req.body.tour = req.params.tourId}; // GET THE TOUR ID IF NOT INCLUDED IN THE REQUEST BODY
  if(!req.body.user) {req.body.user = req.user.id}; // GET THE USER ID FROM THE LOGIN AUTH MIDDLEWARE IF NOT IN THE REQUEST BODY

  next();
};

const getAllReviews = handlerService.getAllHandler(Review);
const createReview = handlerService.createOneHandler(Review);
const deleteReview = handlerService.deleteOneHandler(Review);
const updateReview = handlerService.updateOneHandler(Review);
const getReview = handlerService.getOneHandler(Review);


module.exports = {
  setTourAndUserId,
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReview
};
