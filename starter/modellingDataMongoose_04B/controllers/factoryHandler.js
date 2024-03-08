const catchAsyncError = require('../utils/catchAsyncError');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const deleteHandler = modelService => catchAsyncError(async(req, res, next) => {
  const id = req.params.id;
  const doc = await modelService.findByIdAndDelete(id);
  if(!doc){
    return next(new ApiError("No document Found to Delete", httpStatus.NOT_FOUND));
  };
  res.status(httpStatus.NO_CONTENT).json({status: 'Success'});
});



module.exports = {
  deleteHandler,
};