const Review = require('../models/Review');
const Course = require('../models/Course');

// @desc    Get reviews for a course (by ID or Slug)
// @route   GET /api/reviews/course/:courseId
// @access  Public
const getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    let targetCourseId = courseId;

    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      const found = await Course.findOne({ slug: courseId });
      if (found) {
        targetCourseId = found._id;
      } else {
        return res.json({ success: true, count: 0, reviews: [] });
      }
    }

    const reviews = await Review.find({ course: targetCourseId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a course
// @route   POST /api/reviews/course/:courseId
// @access  Private
const createCourseReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment',
      });
    }

    let course;
    if (courseId.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(courseId);
    } else {
      course = await Course.findOne({ slug: courseId });
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user already reviewed this course
    const alreadyReviewed = await Review.findOne({
      course: course._id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      // Update review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();

      return res.json({
        success: true,
        message: 'Review updated successfully',
        review: alreadyReviewed,
      });
    }

    const review = await Review.create({
      course: course._id,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteCourseReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (String(review.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    const courseId = review.course;
    await review.deleteOne();
    await Review.calcAverageRating(courseId);

    res.json({
      success: true,
      message: 'Review removed',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourseReviews,
  createCourseReview,
  deleteCourseReview,
};
