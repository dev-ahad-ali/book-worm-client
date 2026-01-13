import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios, { type AxiosError } from 'axios';

export interface AppUser {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  role: 'user' | 'admin';
  createdDate: string;
}

interface UsersState {
  users: AppUser[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<AppUser[]>('/api/users');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch users');
  }
});

export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ userId, role }: { userId: string; role: 'user' | 'admin' }, { rejectWithValue }) => {
    try {
      const response = await axios.put<AppUser>(`/api/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update user role');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<AppUser[]>) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(updateUserRole.fulfilled, (state, action: PayloadAction<AppUser>) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default usersSlice.reducer;
