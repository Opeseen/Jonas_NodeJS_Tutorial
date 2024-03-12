const httpStatus = require('http-status');
const catchAsyncError = require('../utils/catchAsyncError');
const { tourService,handlerService } =  require('../services');
const { Tour } = require('../models');


const getAllTours = handlerService.getAllHandler(Tour);
const getTour = handlerService.getOneHandler(Tour, {path: 'reviews'});
const createTour = handlerService.createOneHandler(Tour);
const  updateTour = handlerService.updateOneHandler(Tour);
const deleteTour = handlerService.deleteOneHandler(Tour);

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getTourStats = catchAsyncError(async(req, res) => {
  const stats = await tourService.getTourStats();
  res.status(httpStatus.OK).json({
    status: 'Success',
    stats
  });
});

const getMonthlyPlan = catchAsyncError(async(req, res) => {
  year = req.params.year * 1;
  const plan = await tourService.getMonthlyPlan(year);
  res.status(httpStatus.OK).json({
    status: 'Success',
    results: plan.length,
    plan
  });
});


module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
};
