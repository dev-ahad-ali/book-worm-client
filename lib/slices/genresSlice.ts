import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios, { type AxiosError } from 'axios';

export interface Genre {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GenresState {
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GenresState = {
  genres: [],
  isLoading: false,
  error: null,
};

export const fetchGenres = createAsyncThunk('genres/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Genre[]>('/api/genres');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch genres');
  }
});

export const createGenre = createAsyncThunk(
  'genres/create',
  async (genreData: Omit<Genre, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post<Genre>('/api/genres', genreData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create genre');
    }
  }
);

export const updateGenre = createAsyncThunk(
  'genres/update',
  async ({ id, genreData }: { id: string; genreData: Partial<Genre> }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Genre>(`/api/genres/${id}`, genreData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update genre');
    }
  }
);

export const deleteGenre = createAsyncThunk(
  'genres/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/genres/${id}`);
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete genre');
    }
  }
);

const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<Genre[]>) => {
        state.genres = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(createGenre.fulfilled, (state, action: PayloadAction<Genre>) => {
        state.genres.push(action.payload);
      })
      .addCase(updateGenre.fulfilled, (state, action: PayloadAction<Genre>) => {
        const index = state.genres.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) {
          state.genres[index] = action.payload;
        }
      })
      .addCase(deleteGenre.fulfilled, (state, action: PayloadAction<string>) => {
        state.genres = state.genres.filter((g) => g._id !== action.payload);
      });
  },
});

export default genresSlice.reducer;
