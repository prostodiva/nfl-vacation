import { configureStore } from '@reduxjs/toolkit';
import { teamsApi } from './apis/teamsApi';
import { algorithmApi } from './apis/algorithmApi';

const store = configureStore({
  reducer: {
    [teamsApi.reducerPath]: teamsApi.reducer,
    [algorithmApi.reducerPath]: algorithmApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(teamsApi.middleware)
      .concat(algorithmApi.middleware), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
