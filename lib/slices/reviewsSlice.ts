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
  bookReviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  bookReviews: [],
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

export const fetchBookReviews = createAsyncThunk(
  'reviews/fetchBookReviews',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Review[]>(`/api/reviews/book/${bookId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch book reviews');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/add',
  async (reviewData: Omit<Review, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post<Review>('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to add review');
    }
  }
);

export const approveReview = createAsyncThunk(
  'reviews/approve',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      const response = await axios.put<Review>(`/api/reviews/${reviewId}/approve`);
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
      .addCase(fetchBookReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.bookReviews = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBookReviews.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(addReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.reviews.push(action.payload);
        state.bookReviews.push(action.payload);
      })
      .addCase(approveReview.fulfilled, (state, action: PayloadAction<Review>) => {
        const index = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        const bookIndex = state.bookReviews.findIndex((r) => r._id === action.payload._id);
        if (bookIndex !== -1) {
          state.bookReviews[bookIndex] = action.payload;
        }
      })
      .addCase(rejectReview.fulfilled, (state, action: PayloadAction<string>) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
        state.bookReviews = state.bookReviews.filter((r) => r._id !== action.payload);
      });
  },
});

export default reviewsSlice.reducer;
