const catchAsyncError = require('../utils/catchAsyncError');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const APIFeatures = require('../utils/apiFeatures');


// CREATING A HANDLER FOR DELETE ONE ITEMS
const deleteOneHandler = Model => catchAsyncError(async(req, res, next) => {
  const id = req.params.id;
  const resources = await Model.findByIdAndDelete(id);
  if(!resources){
    return next(new ApiError("No resources Found to Delete", httpStatus.NOT_FOUND));
  };
  res.status(httpStatus.NO_CONTENT).json({status: 'Success'});
});


// CREATING A HANDLER FOR UPDATE ONE ITEMS
const updateOneHandler = Model => catchAsyncError(async(req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const resources = await Model.findByIdAndUpdate(id, data, {new: true, runValidators: true});
  if(!resources){
    return next(new ApiError("No resources Found to Update", httpStatus.NOT_FOUND));
  };
  res.status(httpStatus.OK).json({status: 'Success',resources});
});

// CREATING A HANDLER FOR CREATE ONE ITEMS
const createOneHandler = Model => catchAsyncError(async(req, res, next) => {
  const data = req.body;
  const resources = await Model.create(data);
  res.status(httpStatus.OK).json({status: 'Success',resources});
});

// CREATING HANDLER FOR GET ONE ITEMS
const getOneHandler = (Model, PopulateOptions) => catchAsyncError(async(req, res,next) => {
  const tourID = req.params.id;
  let query = Model.findById(tourID);
  if(PopulateOptions) { query = query.populate(PopulateOptions) };
  const resources = await query;

  if(!resources) { return next(new ApiError("No resources Found", httpStatus.NOT_FOUND)) };
  res.status(httpStatus.OK).json({status: 'Success',resources});
});


// CREATING A HANDLER FPR GET ALL ITEMS
const getAllHandler = Model => catchAsyncError(async(req, res, next) => {
  let filter = {}; //To allow for nested get revews on tour
  if(req.params.tourId) filter = {tour: req.params.tourId}; // Get the "tourId" from params if provided
  const requestQuery = req.query;

  // EXECUTE QUERY...
  const features = new APIFeatures(Model.find(filter),requestQuery)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const resources = await features.query;
  res.status(httpStatus.OK).json({
    status: 'Success',
    results: resources.length,
    resources
  });
});



module.exports = {
  deleteOneHandler,
  updateOneHandler,
  createOneHandler,
  getOneHandler,
  getAllHandler
};