const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  serviceId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [String],
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ booking: 1 });
ReviewSchema.index({ serviceId: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ verified: 1 });

// Virtual for formatted rating
ReviewSchema.virtual('formattedRating').get(function() {
  return '⭐'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

// Virtual for time ago
ReviewSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours === 0 ? 'Just now' : `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
});

// Method to check if user can review
ReviewSchema.methods.canEdit = function(userId) {
  return this.user.toString() === userId && !this.verified;
};

// Static method to get service statistics
ReviewSchema.statics.getServiceStats = async function(serviceId) {
  const stats = await this.aggregate([
    { $match: { serviceId } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalReviews = stats.reduce((sum, stat) => sum + stat.count, 0);
  const averageRating = stats.reduce((sum, stat) => sum + (stat._id * stat.count), 0) / totalReviews;

  return {
    serviceId,
    totalReviews,
    averageRating: averageRating.toFixed(1),
    ratingDistribution: stats
  };
};

// Static method to get user reviews
ReviewSchema.statics.getUserReviews = async function(userId, page = 1, limit = 10) {
  const reviews = await this.find({ user: userId })
    .populate('booking', 'bookingReference')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await this.countDocuments({ user: userId });

  return {
    reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get service reviews
ReviewSchema.statics.getServiceReviews = async function(serviceId, page = 1, limit = 10, verified = true) {
  const match = { serviceId };
  if (verified !== null) {
    match.verified = verified;
  }

  const reviews = await this.find(match)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await this.countDocuments(match);

  return {
    reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to mark review as verified
ReviewSchema.statics.verifyReview = async function(reviewId) {
  return await this.findByIdAndUpdate(
    reviewId,
    { verified: true, verifiedAt: new Date() },
    { new: true }
  );
};

// Static method to mark review as helpful
ReviewSchema.statics.markHelpful = async function(reviewId) {
  return await this.findByIdAndUpdate(
    reviewId,
    { $inc: { helpful: 1 } },
    { new: true }
  );
};

// Static method to get overall statistics
ReviewSchema.statics.getOverallStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        verifiedReviews: {
          $sum: { $cond: [{ $eq: ['$verified', true] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalReviews: 0,
    averageRating: 0,
    verifiedReviews: 0
  };
};

// Pre-save middleware
ReviewSchema.pre('save', function(next) {
  // Check if user already reviewed this booking
  if (this.isNew) {
    mongoose.model('Review').findOne({
      user: this.user,
      booking: this.booking
    }).then(existingReview => {
      if (existingReview) {
        const error = new Error('User has already reviewed this booking');
        error.code = 'DUPLICATE_REVIEW';
        return next(error);
      }
      next();
    }).catch(next);
  } else {
    next();
  }
});

// Ensure virtuals are included in JSON output
ReviewSchema.set('toJSON', { virtuals: true });
ReviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Review', ReviewSchema);
