import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/slices/authSlice';
import booksReducer from '@/lib/slices/booksSlice';
import libraryReducer from '@/lib/slices/librarySlice';
import reviewsReducer from '@/lib/slices/reviewsSlice';
import genresReducer from '@/lib/slices/genresSlice';
import usersReducer from '@/lib/slices/usersSlice';
import tutorialsReducer from '@/lib/slices/tutorialsSlice';
import readingGoalsReducer from '@/lib/slices/readingGoalsSlice';
import activityReducer from '@/lib/slices/activitySlice';
import socialReducer from '@/lib/slices/socialSlice';
import adminStatsReducer from '@/lib/slices/adminStatsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    library: libraryReducer,
    reviews: reviewsReducer,
    genres: genresReducer,
    users: usersReducer,
    tutorials: tutorialsReducer,
    readingGoals: readingGoalsReducer,
    activity: activityReducer,
    social: socialReducer,
    adminStats: adminStatsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
