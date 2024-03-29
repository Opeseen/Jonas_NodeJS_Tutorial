const { tourService } =  require('../services');
const catchAsyncError = require('../utils/catchAsyncError');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = catchAsyncError(async (req, res) => {
  const tours = await tourService.getAllTours(req.query);    
  res.status(httpStatus.OK).json({
    status: 'Success',
    results: tours.length,
    data: {tours}
  });
});

const getTour = catchAsyncError(async(req, res, next) => {
  const id = req.params.id;
  const tour = await tourService.getTour(id);
  if(!tour){
    return next(new ApiError("No Tour Found", httpStatus.NOT_FOUND));
  };
  res.status(httpStatus.OK).json({
    status: 'Success',
    data: {tour}
  });
});

const createTour = catchAsyncError(async(req, res) => {
  const newTour = await tourService.createTour(req.body);
  res.status(httpStatus.CREATED).json({
    status: 'Success',
    data: {tour: newTour}
  });
});

const updateTour = catchAsyncError(async(req, res, next) => {
  const id = req.params.id;
  const updatedTour = await tourService.updateTour(id,req.body);
  if(!updatedTour){
    return next(new ApiError("No Tour Found to Update", httpStatus.NOT_FOUND));
  };
  res.status(httpStatus.OK).json({
    status: 'Success',
    updatedTour
  });
});

const deleteTour = catchAsyncError(async(req, res, next) => {
  const id = req.params.id;
  const tour = await tourService.deleteTour(id);
  if(!tour){
    return next(new ApiError("No Tour Found to Delete", httpStatus.NOT_FOUND));
  };
  res.status(httpStatus.NO_CONTENT).json({status: 'Success'});
});

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
