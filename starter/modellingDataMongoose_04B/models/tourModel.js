const mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => (Math.round(val * 10) / 10) // this will round up decimal points on the results
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        return val < this.price;  
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      private: true
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
    
  },
  
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }

);

tourSchema.plugin(toJson);
tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});
tourSchema.index({startLocation: '2dsphere'});

tourSchema.virtual('durationWeeks')
  .get(function() {
    return this.duration / 7;
});

// VIRTUAL POPULATE HANDLER
tourSchema.virtual('reviews', {
  ref: 'Review', // Name of model to reference
  foreignField: 'tour', // Name of the field in the review model to connect
  localField: '_id' // Loacal field in the model
});

// DOCUMENT MIDDLEWARE

// THIS RUNS BEFORE THE SAVE() AND CREATE() COMMAND
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower: true});
  next();
});


// QUERY MIDDLEWARE TO IGNORE THE SECRET TOUR IN ANY FIND REQUEST
tourSchema.pre(/^find/, function(next) {
  this.find({secretTour: {$ne: true}});
  next();
});

// QUERY MIDDLEWARE TO POPULATE GUIDES DATA
tourSchema.pre(/^find/, function(next) {
  this.populate({path: 'guides'});
  next();
});


// AGGREGATION MIDDLEWARE TO IGNORE THE SECRET TOUR IN THE REQUEST
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
//   next();
// })
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
