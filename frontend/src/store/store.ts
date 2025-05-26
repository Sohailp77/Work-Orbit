// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Typed hooks (recommended)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
