import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authSlice, logout } from '../authSlice';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: number; name: string };
}

interface LoginRequest {
  email: string;
  password: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as any).auth.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  const accessToken = localStorage.getItem('accessToken');

  // Проверяем, является ли args объектом
  const modifiedArgs =
    typeof args === 'object' && args !== null
      ? {
          ...args,
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
            ...args.headers,
          },
        }
      : args; // Если это не объект, оставляем args как есть

  let result = await baseQuery(modifiedArgs, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as any).auth.refreshToken;
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-tokens',
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(
        authSlice.actions.setTokens(refreshResult.data as AuthResponse)
      );
      result = await baseQuery(modifiedArgs, api, extraOptions);
    } else {
      api.dispatch(authSlice.actions.logout());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials: LoginRequest) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation<
      { refreshToken: string; accessToken: string },
      string
    >({
      query: (refreshToken) => ({
        url: '/auth/refresh-tokens',
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` },
      }),
    }),
    signOut: builder.mutation<void, void>({
      // query: () => '/auth/sign-out',
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
      // },
      query: () => ({
        url: '/auth/sign-out',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
        },
      }),
      onQueryStarted: (_, { dispatch }) => {
        dispatch(logout());
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useSignupMutation,
  useSignOutMutation,
} = authApi;
