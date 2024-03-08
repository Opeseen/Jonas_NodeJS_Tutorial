const {Review} = require('../models');

const getAllReviews = async(filter) => {
  const reviews = await Review.find(filter); // Get all reviews

  return reviews;
};


module.exports = {
  getAllReviews,
};