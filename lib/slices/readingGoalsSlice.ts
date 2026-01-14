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
  monthlyProgress: Array<{ month: string; count: number }>;
  weeklyPages: Array<{ week: string; pages: number }>;
  genreDistribution: Array<{ name: string; value: number }>;
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
      const response = await axios.get<{ goal: ReadingGoal }>('/api/reading-stats');
      return response.data.goal;
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
      const response = await axios.put<ReadingGoal>('/api/reading-stats/goal', {
        annualGoal: goal,
      });
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
        state.currentGoal = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchReadingStats.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(updateAnnualGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAnnualGoal.fulfilled, (state, action) => {
        if (state.currentGoal) {
          state.currentGoal.annualGoal = action.payload.annualGoal;
        }
        state.isLoading = false;
      })
      .addCase(updateAnnualGoal.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export default readingGoalsSlice.reducer;
