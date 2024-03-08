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
  const tour = await Tour.findById(tourID).populate('reviews');
  return tour;
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

const getMonthlyPlan = async (year) => {
  const plan = await Tour.aggregate([
    {$unwind: '$startDates'},
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {$month: '$startDates'},
        numTourStart: {$sum: 1},
        tours: {$push: '$name'}
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {_id: 0}
    },
    {
      $sort: {numTourStart: -1}
    }

  ]);
  return plan;
}



module.exports = {
  getAllTours,
  getTour,
  getTourStats,
  getMonthlyPlan
};
