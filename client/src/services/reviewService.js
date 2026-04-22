import api from './api';

export const reviewService = {
  // Create a new review
  create: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Get reviews for a service
  getServiceReviews: async (serviceId, page = 1, limit = 10, verified = null) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (verified !== null) {
      params.append('verified', verified.toString());
    }
    
    const response = await api.get(`/reviews/service/${serviceId}?${params}`);
    return response.data;
  },

  // Get user's reviews
  getUserReviews: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await api.get(`/reviews/my-reviews?${params}`);
    return response.data;
  },

  // Get single review
  getReview: async (reviewId) => {
    const response = await api.get(`/reviews/${reviewId}`);
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (reviewId) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Get service statistics
  getServiceStats: async (serviceId) => {
    const response = await api.get(`/reviews/stats/service/${serviceId}`);
    return response.data;
  },

  // Get overall statistics (admin only)
  getOverallStats: async () => {
    const response = await api.get('/reviews/stats/overall');
    return response.data;
  },

  // Get pending reviews (admin only)
  getPendingReviews: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await api.get(`/reviews/pending?${params}`);
    return response.data;
  },

  // Verify review (admin only)
  verifyReview: async (reviewId) => {
    const response = await api.post(`/reviews/${reviewId}/verify`);
    return response.data;
  }
};

export default reviewService;
