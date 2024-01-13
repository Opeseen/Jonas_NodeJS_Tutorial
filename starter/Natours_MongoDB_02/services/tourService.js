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


const getTourStats = async () => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty'},
        numTours: { $sum: 1 },
        numRatings: {$sum: '$ratingsQuantity'},
        avgRating: {$avg: '$ratingsAverage'},
        avgPrice: {$avg: '$price'},
        minPrice: {$min: '$price'},
        maxPrice: {$max: '$price'},
      }
    },
    {
      $sort: { avgPrice: -1 }
    },
    {
      $match: {_id: {$ne: 'EASY'}}
    }

  ]);

  return stats;
}

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats
};
