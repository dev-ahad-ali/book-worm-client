import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface LibraryItem {
  bookId: string
  shelfType: "wantToRead" | "currentlyReading" | "read"
  addedDate: string
  pagesRead?: number
  startDate?: string
  finishDate?: string
}

interface LibraryState {
  items: LibraryItem[]
}

const initialState: LibraryState = {
  items: [],
}

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setLibraryItems: (state, action: PayloadAction<LibraryItem[]>) => {
      state.items = action.payload
    },
    addToLibrary: (state, action: PayloadAction<LibraryItem>) => {
      state.items.push(action.payload)
    },
    removeFromLibrary: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.bookId !== action.payload)
    },
    updateLibraryItem: (state, action: PayloadAction<LibraryItem>) => {
      const index = state.items.findIndex((item) => item.bookId === action.payload.bookId)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    moveToShelf: (
      state,
      action: PayloadAction<{ bookId: string; shelfType: "wantToRead" | "currentlyReading" | "read" }>,
    ) => {
      const item = state.items.find((item) => item.bookId === action.payload.bookId)
      if (item) {
        item.shelfType = action.payload.shelfType
      }
    },
  },
})

export const { setLibraryItems, addToLibrary, removeFromLibrary, updateLibraryItem, moveToShelf } = librarySlice.actions
export default librarySlice.reducer
