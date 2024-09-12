import { configureStore } from '@reduxjs/toolkit';
import foodTrackerReducer from './foodTrackerSlice';

export const store = configureStore({
  reducer: {
    foodTracker: foodTrackerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;