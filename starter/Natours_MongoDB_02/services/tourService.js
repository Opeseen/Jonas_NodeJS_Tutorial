const {Tour} = require('../models');
const APIFeatures = require('../utils/apiFeatures');

const getAllTours = async (queryObject) => {
const requestQuery = {...queryObject};

  // EXECUTE QUERY...
  const features = new APIFeatures(Tour.find(),requestQuery)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;
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
