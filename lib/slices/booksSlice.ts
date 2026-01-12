import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Book {
  _id: string
  title: string
  author: string
  genre: string
  description: string
  coverImage: string
  totalPages: number
  averageRating: number
  reviewCount: number
  addedToShelvesCount: number
}

interface BooksState {
  books: Book[]
  isLoading: boolean
  error: string | null
}

const initialState: BooksState = {
  books: [],
  isLoading: false,
  error: null,
}

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload
    },
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload)
    },
    updateBook: (state, action: PayloadAction<Book>) => {
      const index = state.books.findIndex((b) => b._id === action.payload._id)
      if (index !== -1) {
        state.books[index] = action.payload
      }
    },
    deleteBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter((b) => b._id !== action.payload)
    },
  },
})

export const { setBooks, addBook, updateBook, deleteBook } = booksSlice.actions
export default booksSlice.reducer
