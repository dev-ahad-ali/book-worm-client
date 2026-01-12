import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Tutorial {
  _id: string
  title: string
  youtubeId: string
  description?: string
  createdDate: string
}

interface TutorialsState {
  tutorials: Tutorial[]
}

const initialState: TutorialsState = {
  tutorials: [],
}

const tutorialsSlice = createSlice({
  name: "tutorials",
  initialState,
  reducers: {
    setTutorials: (state, action: PayloadAction<Tutorial[]>) => {
      state.tutorials = action.payload
    },
    addTutorial: (state, action: PayloadAction<Tutorial>) => {
      state.tutorials.push(action.payload)
    },
    deleteTutorial: (state, action: PayloadAction<string>) => {
      state.tutorials = state.tutorials.filter((t) => t._id !== action.payload)
    },
  },
})

export const { setTutorials, addTutorial, deleteTutorial } = tutorialsSlice.actions
export default tutorialsSlice.reducer
