import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosSecure as axios } from '@/utils/axiosSecure';
import { AxiosError } from 'axios';

interface BookGenreStat {
  _id: string;
  count: number;
}

interface Review {
  _id: string;
  userName: string;
  reviewText: string;
  book: {
    title: string;
  };
}

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
}

interface AdminStats {
  users: number;
  books: number;
  genres: number;
  pendingReviews: number;
  approvedReviews: number;
  booksPerGenre: BookGenreStat[];
  recentBooks: Book[];
  pendingReviewsList: Review[];
}

interface AdminStatsState {
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminStatsState = {
  stats: null,
  isLoading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  'adminStats/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<AdminStats>('/api/admin/stats');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

const adminStatsSlice = createSlice({
  name: 'adminStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export default adminStatsSlice.reducer;
