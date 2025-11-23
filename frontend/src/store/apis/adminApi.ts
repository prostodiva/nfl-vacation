import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginCredentials, User } from '../types/adminTypes';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api'
    }),
    endpoints: (builder) => ({
        login: builder.mutation<User, LoginCredentials>({
            query: (credentials) => ({
                url: '/admin/login',
                method: 'POST',
                body: credentials
            })
        }),
    })
});

export const { useLoginMutation } = adminApi;

