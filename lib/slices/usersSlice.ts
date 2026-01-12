import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface AppUser {
  _id: string
  name: string
  email: string
  photo?: string
  role: "user" | "admin"
  createdDate: string
}

interface UsersState {
  users: AppUser[]
}

const initialState: UsersState = {
  users: [],
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<AppUser[]>) => {
      state.users = action.payload
    },
    addUser: (state, action: PayloadAction<AppUser>) => {
      state.users.push(action.payload)
    },
    updateUserRole: (state, action: PayloadAction<{ userId: string; role: "user" | "admin" }>) => {
      const user = state.users.find((u) => u._id === action.payload.userId)
      if (user) {
        user.role = action.payload.role
      }
    },
  },
})

export const { setUsers, addUser, updateUserRole } = usersSlice.actions
export default usersSlice.reducer
