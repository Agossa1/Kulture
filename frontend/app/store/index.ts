import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/services/auth.slices';
import passwordReducer from '../features/password/services/password.slices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    password: passwordReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;