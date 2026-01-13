import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios, { type AxiosError } from 'axios';

export interface Review {
  _id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  reviewText: string;
  status: 'pending' | 'approved';
  createdDate: string;
}

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  isLoading: false,
  error: null,
};

export const fetchReviews = createAsyncThunk('reviews/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Review[]>('/api/reviews');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch reviews');
  }
});

export const approveReview = createAsyncThunk(
  'reviews/approve',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/reviews/${reviewId}/approve`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to approve review');
    }
  }
);

export const rejectReview = createAsyncThunk(
  'reviews/reject',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to reject review');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.reviews = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(approveReview.fulfilled, (state, action: PayloadAction<Review>) => {
        const index = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(rejectReview.fulfilled, (state, action: PayloadAction<string>) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      });
  },
});

export default reviewsSlice.reducer;
