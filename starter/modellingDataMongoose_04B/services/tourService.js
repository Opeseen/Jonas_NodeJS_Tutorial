const {Tour} = require('../models');

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
  getTourStats,
  getMonthlyPlan
};
