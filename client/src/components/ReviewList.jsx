import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';

const ReviewList = ({ serviceId, limit = 10, showWriteReview = true }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [reviewForm, setReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [serviceId, page]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/service/${serviceId}?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews(prev => [...prev, ...data.reviews]);
      }
      
      setHasMore(data.pagination.page < data.pagination.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });
      
      if (response.ok) {
        const newReview = await response.json();
        setReviews(prev => [newReview.review, ...prev]);
        setReviewForm(false);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setReviews(prev => prev.map(review => 
        review._id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ));
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Write Review Section */}
      {showWriteReview && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <button
              onClick={() => setReviewForm(!reviewForm)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {reviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
          
          {reviewForm && (
            <div className="border-t pt-4">
              <ReviewForm serviceId={serviceId} onSubmit={handleReviewSubmit} />
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 && !loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Reviews ({reviews.length})
          </h3>
          
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={12} />
                        <span>{review.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  
                  {review.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(review.rating)}
                  <span className="ml-2 font-medium">{review.rating}.0</span>
                </div>
                
                <h4 className="font-medium mb-1">{review.title}</h4>
                <p className="text-gray-600 mb-3">{review.comment}</p>
                
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => window.open(image, '_blank')}
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Was this helpful?</span>
                    <button
                      onClick={() => handleMarkHelpful(review._id)}
                      className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                    >
                      <ThumbsUp size={14} />
                      <span>{review.helpful}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Service ID: {review.serviceId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Reviews'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
