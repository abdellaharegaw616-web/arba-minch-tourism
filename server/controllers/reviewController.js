const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { services } = require('../../client/src/data/services');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { bookingId, serviceId, rating, title, comment, images } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!bookingId || !serviceId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        error: 'All required fields must be provided'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only review your own bookings'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'You can only review completed bookings'
      });
    }

    // Check if service exists
    const service = services.find(s => s.id === parseInt(serviceId));
    if (!service) {
      return res.status(400).json({
        success: false,
        error: 'Invalid service ID'
      });
    }

    // Create review
    const review = new Review({
      user: userId,
      booking: bookingId,
      serviceId: parseInt(serviceId),
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      images: images || []
    });

    await review.save();

    // Populate user data for response
    await review.populate('user', 'name email');
    await review.populate('booking', 'bookingReference');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    
    if (error.code === 'DUPLICATE_REVIEW') {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this booking'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all reviews for a service
const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 10, verified } = req.query;

    const service = services.find(s => s.id === parseInt(serviceId));
    if (!service) {
      return res.status(400).json({
        success: false,
        error: 'Invalid service ID'
      });
    }

    const result = await Review.getServiceReviews(
      parseInt(serviceId),
      parseInt(page),
      parseInt(limit),
      verified !== undefined ? verified === 'true' : null
    );

    res.json({
      success: true,
      service: {
        id: service.id,
        name: service.name,
        icon: service.icon
      },
      ...result
    });
  } catch (error) {
    console.error('Get service reviews error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const result = await Review.getUserReviews(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single review
const getReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('user', 'name email')
      .populate('booking', 'bookingReference');

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user can edit this review
    if (!review.canEdit(userId)) {
      return res.status(403).json({
        success: false,
        error: 'You can only edit your own unverified reviews'
      });
    }

    // Update fields
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: 'Rating must be between 1 and 5'
        });
      }
      review.rating = parseInt(rating);
    }

    if (title !== undefined) {
      review.title = title.trim();
    }

    if (comment !== undefined) {
      review.comment = comment.trim();
    }

    if (images !== undefined) {
      review.images = images;
    }

    await review.save();
    await review.populate('user', 'name email');
    await review.populate('booking', 'bookingReference');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user can delete this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own reviews'
      });
    }

    await Review.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    await Review.markHelpful(id);

    res.json({
      success: true,
      message: 'Review marked as helpful',
      helpful: review.helpful + 1
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Verify review (admin only)
const verifyReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const review = await Review.verifyReview(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review verified successfully',
      review
    });
  } catch (error) {
    console.error('Verify review error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get service statistics
const getServiceStats = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = services.find(s => s.id === parseInt(serviceId));
    if (!service) {
      return res.status(400).json({
        success: false,
        error: 'Invalid service ID'
      });
    }

    const stats = await Review.getServiceStats(parseInt(serviceId));

    res.json({
      success: true,
      service: {
        id: service.id,
        name: service.name,
        icon: service.icon
      },
      ...stats
    });
  } catch (error) {
    console.error('Get service stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get overall review statistics (admin only)
const getOverallStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const stats = await Review.getOverallStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get overall stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get pending reviews (admin only)
const getPendingReviews = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ verified: false })
      .populate('user', 'name email')
      .populate('booking', 'bookingReference')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ verified: false });

    res.json({
      success: true,
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get pending reviews error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getServiceReviews,
  getUserReviews,
  getReview,
  updateReview,
  deleteReview,
  markHelpful,
  verifyReview,
  getServiceStats,
  getOverallStats,
  getPendingReviews
};
