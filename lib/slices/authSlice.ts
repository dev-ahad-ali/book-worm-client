import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosSecure from '@/utils/axiosSecure';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosSecure.post('/auth/register', payload);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosSecure.post('/auth/login', payload);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosSecure.get('/auth/me');
    return data.user;
  } catch {
    return rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
