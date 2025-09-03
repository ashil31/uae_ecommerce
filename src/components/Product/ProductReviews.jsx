
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiStar, FiUser, FiThumbsUp, FiLoader } from 'react-icons/fi';
import { fetchReviews, submitReview, markReviewHelpful, resetReviewState } from '../../store/slices/reviewSlice';
import toast from 'react-hot-toast';

const ProductReviews = ({ productId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { 
    reviews, 
    reviewSummary, 
    pagination, 
    loading, 
    submitLoading, 
    error, 
    success 
  } = useSelector((state) => state.reviews);
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [sortBy, setSortBy] = useState('newest');
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    review: '',
    name: user?.name || ''
  });

  // Fetch reviews when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      dispatch(fetchReviews({ productId, page: 1, sort: sortBy }));
    }
  }, [dispatch, productId, sortBy]);

  // Handle review submission success
  useEffect(() => {
    if (success) {
      toast.success('Review submitted successfully!');
      setNewReview({
        rating: 5,
        title: '',
        review: '',
        name: user?.name || ''
      });
      setActiveTab('reviews');
      dispatch(resetReviewState());
    }
  }, [success, dispatch, user]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetReviewState());
    }
  }, [error, dispatch]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!newReview.review.trim()) {
      toast.error('Please write a review');
      return;
    }

    const reviewData = {
      user: user._id,
      name: newReview.name || user.name,
      email: user.email,
      rating: newReview.rating,
      review: newReview.review,
      title: newReview.title
    };

    dispatch(submitReview({ productId, reviewData }));
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loading) {
      dispatch(fetchReviews({ 
        productId, 
        page: pagination.currentPage + 1, 
        sort: sortBy 
      }));
    }
  };

  const handleHelpfulClick = (reviewId) => {
    if (!isAuthenticated) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }
    dispatch(markReviewHelpful({ reviewId, userId: user._id }));
  };

  // Check if user has already reviewed this product
  const userHasReviewed = reviews.some(review => review.user?._id === user?._id);

  const StarRating = ({ rating, size = 16, interactive = false, onRatingChange }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          onClick={interactive ? () => onRatingChange(star) : undefined}
        >
          <FiStar
            size={size}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reviews'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviewSummary.totalReviews})
          </button>
          {isAuthenticated && !userHasReviewed && (
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'write'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('write')}
            >
              Write a Review
            </button>
          )}
        </nav>
      </div>

      {activeTab === 'reviews' && (
        <div className="space-y-8">
          {/* Sort and Filter */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Customer Reviews</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border bg-[#f2f2f2] border-gray-300 rounded-md text-sm focus:outline-none focus:border-black"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {/* Rating Summary */}
          {reviewSummary.totalReviews > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-light">{reviewSummary.averageRating.toFixed(1)}</div>
                  <div>
                    <StarRating rating={Math.round(reviewSummary.averageRating)} size={20} />
                    <p className="text-sm text-gray-600 mt-1">Based on {reviewSummary.totalReviews} reviews</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {reviewSummary.ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm">{item.rating}</span>
                      <FiStar size={12} className="fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {loading && reviews.length === 0 ? (
              <div className="flex justify-center py-8">
                <FiLoader className="animate-spin text-2xl text-gray-400" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b border-gray-100 pb-6 last:border-b-0"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser size={20} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{review.name}</h4>
                          {review.isVerifiedPurchase && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <time className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <StarRating rating={review.rating} />
                        {review.title && <h5 className="font-medium text-sm">{review.title}</h5>}
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.review}</p>
                      
                      <button 
                        onClick={() => handleHelpfulClick(review._id)}
                        className={`flex items-center space-x-2 text-sm transition-colors ${
                          review.isHelpful 
                            ? 'text-blue-600 hover:text-blue-700' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        disabled={!isAuthenticated}
                      >
                        <FiThumbsUp size={14} />
                        <span>Helpful ({review.helpful || 0})</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {/* Load More Button */}
            {pagination.hasNextPage && (
              <div className="text-center pt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <FiLoader className="animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More Reviews'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'write' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isAuthenticated ? (
            userHasReviewed ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You have already reviewed this product</p>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Reviews
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium mb-2">Overall Rating *</label>
                  <StarRating
                    rating={newReview.rating}
                    size={24}
                    interactive={true}
                    onRatingChange={(rating) => setNewReview({...newReview, rating})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Review Title</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    className="w-full px-4 py-3 border bg-[#f2f2f2] border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Give your review a title (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Review *</label>
                  <textarea
                    value={newReview.review}
                    onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border  bg-[#f2f2f2] border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="Tell us about your experience with this product"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full px-4 py-3 border bg-[#f2f2f2] border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? (
                    <div className="flex items-center space-x-2">
                      <FiLoader className="animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Please log in to write a review</p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProductReviews;
