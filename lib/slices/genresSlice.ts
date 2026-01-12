import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Genre {
  _id: string
  name: string
  description?: string
  icon?: string
}

interface GenresState {
  genres: Genre[]
}

const initialState: GenresState = {
  genres: [],
}

const genresSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    setGenres: (state, action: PayloadAction<Genre[]>) => {
      state.genres = action.payload
    },
    addGenre: (state, action: PayloadAction<Genre>) => {
      state.genres.push(action.payload)
    },
    updateGenre: (state, action: PayloadAction<Genre>) => {
      const index = state.genres.findIndex((g) => g._id === action.payload._id)
      if (index !== -1) {
        state.genres[index] = action.payload
      }
    },
    deleteGenre: (state, action: PayloadAction<string>) => {
      state.genres = state.genres.filter((g) => g._id !== action.payload)
    },
  },
})

export const { setGenres, addGenre, updateGenre, deleteGenre } = genresSlice.actions
export default genresSlice.reducer
