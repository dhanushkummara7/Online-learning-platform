const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please write a review comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per course
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Static method to calculate average rating of course
reviewSchema.statics.calcAverageRating = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  const Course = mongoose.model('Course');
  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewsCount: stats[0].nRating,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      rating: 4.8,
      reviewsCount: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.course);
});

reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.course);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
