import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../../services/url';

// Async thunk to submit a review
export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async ({ productId, reviewData }, thunkAPI) => {
    try {
      const response = await axios.post(`${serverUrl}/products/${productId}/reviews`, reviewData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

// Async thunk to fetch reviews
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ productId, page = 1, limit = 10, sort = 'newest' }, thunkAPI) => {
    try {
      const response = await axios.get(`${serverUrl}/products/${productId}/reviews`, {
        params: { page, limit, sort }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

// Async thunk to mark review as helpful
export const markReviewHelpful = createAsyncThunk(
  'reviews/markHelpful',
  async ({ reviewId, userId }, thunkAPI) => {
    try {
      const response = await axios.put(`${serverUrl}/products/reviews/${reviewId}/helpful`, 
        { userId },
        {
          withCredentials: true
        }
      );
      return { reviewId, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update helpful status');
    }
  }
);



// Review Slice
const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    reviewSummary: {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: []
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalReviews: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10
    },
    loading: false,
    submitLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetReviewState: (state) => {
      state.submitLoading = false;
      state.error = null;
      state.success = false;
    },
    clearReviews: (state) => {
      state.reviews = [];
      state.reviewSummary = {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: []
      };
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Review
      .addCase(submitReview.pending, (state) => {
        state.submitLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.success = true;
        // Add new review to the beginning of the list
        state.reviews.unshift(action.payload.review);
        // Update summary
        state.reviewSummary.totalReviews += 1;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        const { reviews, pagination, summary } = action.payload;
        
        if (pagination.currentPage === 1) {
          state.reviews = reviews;
        } else {
          state.reviews = [...state.reviews, ...reviews];
        }
        
        state.pagination = pagination;
        state.reviewSummary = summary;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark Review Helpful
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        const { reviewId, helpful, isHelpful } = action.payload;
        const review = state.reviews.find(r => r._id === reviewId);
        if (review) {
          review.helpful = helpful;
          review.isHelpful = isHelpful;
        }
      });
  },
});

export const { resetReviewState, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
