import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ReadingGoal {
  _id: string
  userId: string
  annualGoal: number
  booksReadThisYear: number
  totalPagesRead: number
  averageRating: number
  favoriteGenre: string
  readingStreak: number
  startDate: string
}

interface ReadingGoalsState {
  goals: ReadingGoal[]
  currentGoal: ReadingGoal | null
}

const initialState: ReadingGoalsState = {
  goals: [],
  currentGoal: null,
}

const readingGoalsSlice = createSlice({
  name: "readingGoals",
  initialState,
  reducers: {
    setReadingGoals: (state, action: PayloadAction<ReadingGoal[]>) => {
      state.goals = action.payload
    },
    setCurrentGoal: (state, action: PayloadAction<ReadingGoal>) => {
      state.currentGoal = action.payload
    },
    updateAnnualGoal: (state, action: PayloadAction<number>) => {
      if (state.currentGoal) {
        state.currentGoal.annualGoal = action.payload
      }
    },
    incrementBooksRead: (state) => {
      if (state.currentGoal) {
        state.currentGoal.booksReadThisYear += 1
      }
    },
    updatePagesRead: (state, action: PayloadAction<number>) => {
      if (state.currentGoal) {
        state.currentGoal.totalPagesRead += action.payload
      }
    },
    updateReadingStreak: (state, action: PayloadAction<number>) => {
      if (state.currentGoal) {
        state.currentGoal.readingStreak = action.payload
      }
    },
  },
})

export const {
  setReadingGoals,
  setCurrentGoal,
  updateAnnualGoal,
  incrementBooksRead,
  updatePagesRead,
  updateReadingStreak,
} = readingGoalsSlice.actions
export default readingGoalsSlice.reducer
