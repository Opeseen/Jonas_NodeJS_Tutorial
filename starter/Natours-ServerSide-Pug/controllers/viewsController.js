const httpStatus = require('http-status');
const {Tour} = require('../models');
const catchAsyncError = require('../utils/catchAsyncError');


const getOverview = catchAsyncError(async(req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();

  res.status(httpStatus.OK).render('overview', {
    title: 'All Tours',
    tours
  });
});

const getTour = catchAsyncError(async(req, res) => {
  // Get the data for the request
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  res.status(httpStatus.OK).render('tour', {
    title: tour.name,
    tour
  });

});




module.exports = {
  getOverview,
  getTour
};