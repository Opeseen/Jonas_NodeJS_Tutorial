const mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }

  },

  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }

);

reviewSchema.plugin(toJson);
reviewSchema.index({rating: -1});
reviewSchema.index({tour: 1, user: 1}, {unique: true}); // this will disallow dulicate review via the same user and same tour

// QUERY MIDDLEWARE TO POPULATE REVIEWS DATA
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  })
  next();
});


reviewSchema.statics.calcAverageRatings = async function(tourID){
  const review = this;
  const stats = await review.aggregate([
    {
      $match: {tour: tourID}
    },
    {
      $group: {
        _id: '$tour',
        nRating: {$sum: 1},
        avgRating: {$avg: '$rating'}
      }
    }
  ]);
  if(stats.length > 0){
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating
    });
  }else{
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5
    });
  }
  
};

reviewSchema.post('save', function(){
  // This points to the current review been saved
  const review = this;
  review.constructor.calcAverageRatings(review.tour);
});

// Set middleware on all "findOneAnd"
reviewSchema.pre(/^findOneAnd/, async function(next){
  this.reviewFetched = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function(){
  // await this.findOne(); does not work here, because the query has already exccuted
  if(this.reviewFetched !== null){ // this will not run if the specified reviews is not found on the database
    await this.reviewFetched.constructor.calcAverageRatings(this.reviewFetched.tour);
  };
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;