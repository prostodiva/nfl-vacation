import { configureStore } from '@reduxjs/toolkit';
import { teamsApi } from './apis/teamsApi';
import { algorithmApi } from './apis/algorithmApi';
import { adminApi } from './apis/adminApi';
import authReducer from './slices/authSlice';
import { stadiumApi } from './apis/stadiumsApi';
import { souvenirsApi } from './apis/souvenirsApi';

const store = configureStore({
  reducer: {
    [teamsApi.reducerPath]: teamsApi.reducer,
    [stadiumApi.reducerPath]: stadiumApi.reducer,
    [algorithmApi.reducerPath]: algorithmApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [souvenirsApi.reducerPath]: souvenirsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(teamsApi.middleware)
      .concat(stadiumApi.middleware)
      .concat(algorithmApi.middleware)
      .concat(adminApi.middleware)
      .concat(souvenirsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
