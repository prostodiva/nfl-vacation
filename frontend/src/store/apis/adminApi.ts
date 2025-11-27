import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginCredentials, User } from '../types/adminTypes';

interface ImportResponse {
    success: boolean;
    message: string;
    output?: string;
    importedCount?: number;
    type?: 'teams' | 'distances';
    error?: string;
}

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
          importFromExcel: builder.mutation<ImportResponse, FormData>({
            query: (formData) => ({
                url: '/admin/import',
                method: 'POST',
                body: formData,
                // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
            })
        }),
    })
});

export const { useLoginMutation, useImportFromExcelMutation } = adminApi;

