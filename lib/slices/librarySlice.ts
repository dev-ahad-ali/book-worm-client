import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import { axiosSecure as axios } from '@/utils/axiosSecure';

export interface LibraryItem {
  _id?: string;
  bookId: string;
  shelfType: 'wantToRead' | 'currentlyReading' | 'read';
  addedDate: string;
  pagesRead?: number;
  startDate?: string;
  finishDate?: string;
}

interface LibraryState {
  items: LibraryItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LibraryState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchLibrary = createAsyncThunk('library/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<LibraryItem[]>('/api/library');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch library');
  }
});

export const addToLibrary = createAsyncThunk(
  'library/add',
  async (item: LibraryItem, { rejectWithValue }) => {
    try {
      const response = await axios.post<LibraryItem>('/api/library', item);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to add to library');
    }
  }
);

export const removeFromLibrary = createAsyncThunk(
  'library/remove',
  async (bookId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/library/${bookId}`);
      return bookId;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to remove from library');
    }
  }
);

export const moveToShelf = createAsyncThunk(
  'library/move',
  async (
    {
      bookId,
      shelfType,
    }: { bookId: string; shelfType: 'wantToRead' | 'currentlyReading' | 'read' },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<LibraryItem>(`/api/library/${bookId}/shelf`, { shelfType });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to move shelf');
    }
  }
);

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibrary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLibrary.fulfilled, (state, action: PayloadAction<LibraryItem[]>) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLibrary.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(addToLibrary.fulfilled, (state, action: PayloadAction<LibraryItem>) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromLibrary.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.bookId !== action.payload);
      })
      .addCase(moveToShelf.fulfilled, (state, action: PayloadAction<LibraryItem>) => {
        const index = state.items.findIndex((item) => item.bookId === action.payload.bookId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default librarySlice.reducer;
