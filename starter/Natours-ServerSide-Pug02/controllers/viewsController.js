const httpStatus = require('http-status');
const {Tour} = require('../models');
const catchAsyncError = require('../utils/catchAsyncError');
const ApiError = require('../utils/ApiError');


const getOverview = catchAsyncError(async(req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();
  res.status(httpStatus.OK).render('overview', {
    title: 'All Tours',
    tours
  });
});

const getTour = catchAsyncError(async(req, res, next) => {
  // Get the data for the request
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if(!tour){return next(new ApiError("No Tour Found!", httpStatus.NOT_FOUND))};

  res.status(httpStatus.OK).render('tour', {
    title: tour.name,
    tour
  });

});


const getLoginForm = (req, res) => {
  res.status(httpStatus.OK).render('login', {
    title: 'Login to your account'
  })
};



module.exports = {
  getOverview,
  getTour,
  getLoginForm
};