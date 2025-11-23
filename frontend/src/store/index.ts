import { configureStore } from '@reduxjs/toolkit';
import { teamsApi } from './apis/teamsApi';
import { algorithmApi } from './apis/algorithmApi';
import { adminApi } from './apis/adminApi';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    [teamsApi.reducerPath]: teamsApi.reducer,
    [algorithmApi.reducerPath]: algorithmApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(teamsApi.middleware)
      .concat(algorithmApi.middleware)
      .concat(adminApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
