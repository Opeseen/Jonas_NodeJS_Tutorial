const {Review} = require('../models');

const getAllReviews = async(filter) => {
  const reviews = await Review.find(filter); // Get all reviews

  return reviews;
};

const createReview = async(reviewsDetails) => {
  const newReview = await Review.create(reviewsDetails); // Create new reviews

  return newReview
};


module.exports = {
  getAllReviews,
  createReview
};