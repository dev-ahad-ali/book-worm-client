import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import { axiosSecure as axios } from '@/utils/axiosSecure';

export interface SocialUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  booksRead: number;
  followers: number;
  following: number;
}

interface SocialState {
  followingUsers: SocialUser[];
  suggestedUsers: SocialUser[];
  followers: SocialUser[];
  userFollowers: SocialUser[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activities: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SocialState = {
  followingUsers: [],
  suggestedUsers: [],
  followers: [],
  userFollowers: [],
  activities: [],
  isLoading: false,
  error: null,
};

export const fetchSuggestedUsers = createAsyncThunk(
  'social/suggestedUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<SocialUser[]>('/api/users/suggested');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch suggestions');
    }
  }
);

export const fetchActivityFeed = createAsyncThunk(
  'social/activityFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/activities');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch activities');
    }
  }
);

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFollowingUsers: (state, action: PayloadAction<SocialUser[]>) => {
      state.followingUsers = action.payload;
    },
    setSuggestedUsers: (state, action: PayloadAction<SocialUser[]>) => {
      state.suggestedUsers = action.payload;
    },
    setFollowers: (state, action: PayloadAction<SocialUser[]>) => {
      state.followers = action.payload;
    },
    setUserFollowers: (state, action: PayloadAction<SocialUser[]>) => {
      state.userFollowers = action.payload;
    },
    followUser: (state, action: PayloadAction<SocialUser>) => {
      if (!state.followingUsers.find((u) => u._id === action.payload._id)) {
        state.followingUsers.push(action.payload);
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      state.followingUsers = state.followingUsers.filter((u) => u._id !== action.payload);
      state.followers = state.followers.filter((u) => u._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.suggestedUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(fetchActivityFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActivityFeed.fulfilled, (state, action) => {
        state.activities = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchActivityFeed.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const {
  setFollowingUsers,
  setSuggestedUsers,
  followUser,
  unfollowUser,
  setFollowers,
  setUserFollowers,
} = socialSlice.actions;
export default socialSlice.reducer;
