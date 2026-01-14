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

interface BooksResponse {
  books: Book[];
  totalCount: number;
  page: number;
  totalPages: number;
}

interface BooksState {
  books: Book[];
  filteredBooks: Book[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const initialState: BooksState = {
  books: [],
  filteredBooks: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
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

export const fetchFilteredBooks = createAsyncThunk(
  'books/fetchFiltered',
  async (
    params: {
      search?: string;
      genres?: string[];
      rating?: number;
      sort?: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const { search, genres, rating, sort, page, limit } = params;
      const response = await axios.get<BooksResponse>('/api/books', {
        params: {
          search,
          genres: genres?.join(','),
          rating,
          sort,
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch books');
    }
  }
);

export const fetchBookDetails = createAsyncThunk(
  'books/fetchDetails',
  async (bookId: string, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axios.get<{ book: Book; reviews: any[] }>(`/api/books/${bookId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch book details');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
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
      .addCase(fetchFilteredBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFilteredBooks.fulfilled, (state, action: PayloadAction<BooksResponse>) => {
        state.filteredBooks = action.payload.books;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.isLoading = false;
      })
      .addCase(fetchFilteredBooks.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(fetchBookDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => {
        const existingBook = state.books.find((b) => b._id === action.payload.book._id);
        if (!existingBook) {
          state.books.push(action.payload.book);
        }
        state.isLoading = false;
      })
      .addCase(fetchBookDetails.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const { setCurrentPage } = booksSlice.actions;
export default booksSlice.reducer;
