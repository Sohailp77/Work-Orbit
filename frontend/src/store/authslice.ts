// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserIdFromToken } from '../api/auth';

interface AuthState {
  userId: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  userId: null,
  loading: false,
};

// Create async thunk
export const fetchUserIdFromToken = createAsyncThunk(
  'auth/fetchUserIdFromToken',
  async (_, thunkAPI) => {
    const userId = getUserIdFromToken();
    return userId; // resolves into fulfilled action
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    logout: (state) => {
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserIdFromToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserIdFromToken.fulfilled, (state, action) => {
        state.userId = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserIdFromToken.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUserId, logout } = authSlice.actions;

export default authSlice.reducer;
