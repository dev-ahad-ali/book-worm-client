import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios, { type AxiosError } from 'axios';

export interface Tutorial {
  _id: string;
  title: string;
  youtubeId: string;
  description?: string;
  createdDate: string;
}

interface TutorialsState {
  tutorials: Tutorial[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TutorialsState = {
  tutorials: [],
  isLoading: false,
  error: null,
};

export const fetchTutorials = createAsyncThunk(
  'tutorials/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Tutorial[]>('/api/tutorials');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch tutorials');
    }
  }
);

export const createTutorial = createAsyncThunk(
  'tutorials/create',
  async (tutorialData: Omit<Tutorial, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post<Tutorial>('/api/tutorials', tutorialData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create tutorial');
    }
  }
);

export const deleteTutorial = createAsyncThunk(
  'tutorials/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/tutorials/${id}`);
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete tutorial');
    }
  }
);

const tutorialsSlice = createSlice({
  name: 'tutorials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutorials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTutorials.fulfilled, (state, action: PayloadAction<Tutorial[]>) => {
        state.tutorials = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTutorials.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(createTutorial.fulfilled, (state, action: PayloadAction<Tutorial>) => {
        state.tutorials.push(action.payload);
      })
      .addCase(deleteTutorial.fulfilled, (state, action: PayloadAction<string>) => {
        state.tutorials = state.tutorials.filter((t) => t._id !== action.payload);
      });
  },
});

export default tutorialsSlice.reducer;
