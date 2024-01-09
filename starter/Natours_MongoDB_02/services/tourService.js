const {Tour} = require('../models');

const getAllTours = async (queryObject) => {

  // BUILDING QUERY...

  // 1A) FILTERING
  const query = {...queryObject};
  const excludedFields = ['page','sort','limit','fields'];
  excludedFields.forEach(element => delete query[element]);

  // 1B) ADVANCE FILTERING..
  let queryString = JSON.stringify(query);
  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  let queryData = Tour.find(JSON.parse(queryString));

  // 2) SORTING...
  if(queryObject.sort){
    const sortBy = queryObject.sort.split(',').join(' ');
    queryData = queryData.sort(sortBy);
  }else(
    queryData = queryData.sort('maxGroupSize')
  );

  // FIELDS LIMITING...
  if(queryObject.fields){
    const fields = queryObject.fields.split(',').join(' ');
    queryData = queryData.select(fields);
  }

  // EXECUTE QUERY...
  const tours = await queryData;
  return tours;
};

const getTour = async (tourID) => {
  const tour = await Tour.findById(tourID);
  return tour;
};

const createTour = async (tourDetails) => {
  const tour = await Tour.create(tourDetails);
  return tour;
};

const updateTour = async (id, tourBody) => {
  const tour = await Tour.findByIdAndUpdate(id, tourBody, {new: true, runValidators: true});
  return tour;
};

const deleteTour = async (tourID) => {
  await Tour.findByIdAndDelete(tourID);
};


module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
};
