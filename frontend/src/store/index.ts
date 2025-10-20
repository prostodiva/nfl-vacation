import { configureStore } from '@reduxjs/toolkit';
import { teamsApi } from './apis/teamsApi';

const store = configureStore({
  reducer: {
    [teamsApi.reducerPath]: teamsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(teamsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
