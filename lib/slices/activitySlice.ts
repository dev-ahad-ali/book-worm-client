import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Activity {
  _id: string
  userId: string
  userName: string
  action: "added" | "rated" | "finished" | "started"
  bookId: string
  bookTitle: string
  shelfType?: "wantToRead" | "currentlyReading" | "read"
  rating?: number
  timestamp: string
}

interface ActivityState {
  activities: Activity[]
}

const initialState: ActivityState = {
  activities: [],
}

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setActivities: (state, action: PayloadAction<Activity[]>) => {
      state.activities = action.payload
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.unshift(action.payload)
    },
  },
})

export const { setActivities, addActivity } = activitySlice.actions
export default activitySlice.reducer
