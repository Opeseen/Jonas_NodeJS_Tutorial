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

const getTour = (req, res) => {
  res.status(httpStatus.OK).render('tour', {
    title: 'The Forest Hiker Tour'
  });
};




module.exports = {
  getOverview,
  getTour
};