import { configureStore } from '@reduxjs/toolkit';
import authReducer from './state/authSlice';
import { tasksApi } from './state/api/tasksApi';
import { authApi } from './state/api/authApi';
import { chartApi } from './state/api/chartApi';
// import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [chartApi.reducerPath]: chartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {}, // Если нужен аргумент для thunk
      },
    }).concat(tasksApi.middleware, authApi.middleware, chartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
