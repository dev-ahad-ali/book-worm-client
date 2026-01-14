import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios, { type AxiosError } from 'axios';

export interface ReadingGoal {
  _id: string;
  userId: string;
  annualGoal: number;
  booksReadThisYear: number;
  totalPagesRead: number;
  averageRating: number;
  favoriteGenre: string;
  readingStreak: number;
  startDate: string;
}

interface ReadingGoalsState {
  goals: ReadingGoal[];
  currentGoal: ReadingGoal | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReadingGoalsState = {
  goals: [],
  currentGoal: null,
  isLoading: false,
  error: null,
};

export const fetchReadingStats = createAsyncThunk(
  'readingGoals/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/reading-stats');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch reading stats');
    }
  }
);

export const updateAnnualGoal = createAsyncThunk(
  'readingGoals/updateAnnual',
  async (goal: number, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/reading-stats/goal', { annualGoal: goal });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update goal');
    }
  }
);

const readingGoalsSlice = createSlice({
  name: 'readingGoals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReadingStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReadingStats.fulfilled, (state, action) => {
        state.currentGoal = action.payload.goal;
        state.isLoading = false;
      })
      .addCase(fetchReadingStats.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(updateAnnualGoal.fulfilled, (state, action) => {
        if (state.currentGoal) {
          state.currentGoal.annualGoal = action.payload.annualGoal;
        }
      });
  },
});

export default readingGoalsSlice.reducer;
