import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface SocialUser {
  _id: string
  name: string
  email: string
  profileImage?: string
  booksRead: number
  followers: number
  following: number
}

interface SocialState {
  followingUsers: SocialUser[]
  suggestedUsers: SocialUser[]
  followers: SocialUser[]
  userFollowers: SocialUser[]
}

const initialState: SocialState = {
  followingUsers: [],
  suggestedUsers: [],
  followers: [],
  userFollowers: [],
}

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    setFollowingUsers: (state, action: PayloadAction<SocialUser[]>) => {
      state.followingUsers = action.payload
    },
    setSuggestedUsers: (state, action: PayloadAction<SocialUser[]>) => {
      state.suggestedUsers = action.payload
    },
    setFollowers: (state, action: PayloadAction<SocialUser[]>) => {
      state.followers = action.payload
    },
    setUserFollowers: (state, action: PayloadAction<SocialUser[]>) => {
      state.userFollowers = action.payload
    },
    followUser: (state, action: PayloadAction<SocialUser>) => {
      if (!state.followingUsers.find((u) => u._id === action.payload._id)) {
        state.followingUsers.push(action.payload)
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      state.followingUsers = state.followingUsers.filter((u) => u._id !== action.payload)
      state.followers = state.followers.filter((u) => u._id !== action.payload)
    },
  },
})

export const { setFollowingUsers, setSuggestedUsers, followUser, unfollowUser, setFollowers, setUserFollowers } =
  socialSlice.actions
export default socialSlice.reducer
