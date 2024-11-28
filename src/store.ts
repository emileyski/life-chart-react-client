import { configureStore } from '@reduxjs/toolkit';
import authReducer from './state/authSlice';
import { tasksApi } from './state/api/tasksApi';
import { authApi } from './state/api/authApi';
// import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {}, // Если нужен аргумент для thunk
      },
    }).concat(tasksApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
