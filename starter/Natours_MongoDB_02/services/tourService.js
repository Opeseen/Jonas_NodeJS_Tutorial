const Tour = require('../models');

const getAllTours = async () => {
  const tours = await Tour.find();
  return tours;
};

const getTour = async (tourID) => {
  const tour = await Tour.findById(tourID);
  return tour;
};

const createTour = async (tourDetails) => {
  await Tour.create(tourDetails);

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
