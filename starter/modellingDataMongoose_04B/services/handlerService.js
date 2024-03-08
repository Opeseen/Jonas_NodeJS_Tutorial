const catchAsyncError = require('../utils/catchAsyncError');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');


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


module.exports = {
  deleteOneHandler,
  updateOneHandler,
  createOneHandler
};