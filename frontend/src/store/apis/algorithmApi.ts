import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AlgorithmData } from '../types/algorithmTypes';

interface AlgorithmResponse {
    success: boolean;
    data: AlgorithmData;
}

export const algorithmApi = createApi({
    reducerPath: 'algorithmApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/graph',
    }),
    tagTypes: ['Algorithm'],
    endpoints: (builder) => ({
        getAlgorithmData: builder.query<AlgorithmResponse, string>({
            query: (algorithmType) => `/${algorithmType.toLowerCase()}`,
            providesTags: ['Algorithm'],
        }),
    }),
});

export const { useGetAlgorithmDataQuery } = algorithmApi;