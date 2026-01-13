import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios, { type AxiosError } from 'axios';

export type Book = {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  totalPages: number;
  averageRating: number;
  reviewCount: number;
  addedToShelvesCount: number;
  createdAt?: string;
  updatedAt?: string;
};

interface BooksState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  isLoading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk('books/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Book[]>('/api/books');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch books');
  }
});

export const createBook = createAsyncThunk(
  'books/create',
  async (bookData: Omit<Book, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post<Book>('/api/books', bookData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create book');
    }
  }
);

export const editBook = createAsyncThunk(
  'books/update',
  async ({ id, bookData }: { id: string; bookData: Partial<Book> }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Book>(`/api/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update book');
    }
  }
);

export const removeBook = createAsyncThunk(
  'books/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/books/${id}`);
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete book');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.books = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(createBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.books.push(action.payload);
      })
      .addCase(editBook.fulfilled, (state, action: PayloadAction<Book>) => {
        const index = state.books.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(removeBook.fulfilled, (state, action: PayloadAction<string>) => {
        state.books = state.books.filter((b) => b._id !== action.payload);
      });
  },
});

export default booksSlice.reducer;
