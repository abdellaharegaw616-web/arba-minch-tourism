const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/reviewController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Create a new review
router.post('/', authenticate, createReview);

// Get all reviews for a service
router.get('/service/:serviceId', getServiceReviews);

// Get user's reviews
router.get('/my-reviews', authenticate, getUserReviews);

// Get single review
router.get('/:id', getReview);

// Update review
router.put('/:id', authenticate, updateReview);

// Delete review
router.delete('/:id', authenticate, deleteReview);

// Mark review as helpful
router.post('/:id/helpful', authenticate, markHelpful);

// Verify review (admin only)
router.post('/:id/verify', requireAdmin, verifyReview);

// Get service statistics
router.get('/stats/service/:serviceId', getServiceStats);

// Get overall review statistics (admin only)
router.get('/stats/overall', authenticate, requireAdmin, getOverallStats);

// Get pending reviews (admin only)
router.get('/pending', authenticate, requireAdmin, getPendingReviews);

module.exports = router;
