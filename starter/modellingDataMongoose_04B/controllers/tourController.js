const httpStatus = require('http-status');
const catchAsyncError = require('../utils/catchAsyncError');
const { tourService,handlerService } =  require('../services');
const { Tour } = require('../models');
const ApiError = require('../utils/ApiError');


const getAllTours = handlerService.getAllHandler(Tour);
const getTour = handlerService.getOneHandler(Tour, {path: 'reviews'});
const createTour = handlerService.createOneHandler(Tour);
const updateTour = handlerService.updateOneHandler(Tour);
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

// {{URL}}api/v1/tours/tours-within/400/center/34.111745,-118.113491/unit/mi
const getTourWithin = catchAsyncError(async(req, res, next) => {
  const {distance, latlng, unit} = req.params;
  const [lat,lng] = latlng.split(',');

  if (!(lat || lng)){ return next(new ApiError('Please provide latitude and longitude in the format lat, lng',httpStatus.BAD_REQUEST)) };
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tours = await tourService.getTourWithin(lat,lng,radius);

  res.status(httpStatus.OK).json({
    status: 'Success',
    results: tours.length,
    data: tours
  });
});

const getDistances = catchAsyncError(async(req,res,next) => {
  const {latlng, unit} = req.params;
  const [lat,lng] = latlng.split(',');

  if (!(lat || lng)){ return next(new ApiError('Please provide latitude and longitude in the format lat, lng',httpStatus.BAD_REQUEST)) };
  const multiplier = unit === 'mi' ? 0.00062137 : 0.001;
  const tours = await tourService.getDistances(lat,lng, multiplier);

  res.status(httpStatus.OK).json({
    status: 'Success',
    results: tours.length,
    data: tours
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
  getMonthlyPlan,
  getTourWithin,
  getDistances
};
