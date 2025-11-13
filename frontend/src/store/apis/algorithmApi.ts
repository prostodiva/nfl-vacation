import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AlgorithmData } from '../types/algorithmTypes';
import type { CustomRouteRequest, CustomRouteResponse } from '../types/algorithmTypes';

interface AlgorithmResponse {
    success: boolean;
    data: AlgorithmData;
}

export const algorithmApi = createApi({
    reducerPath: 'algorithmApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
    }),
    tagTypes: ['Algorithm'],
    endpoints: (builder) => ({
        //DFS/BFS/dijkstra
        getAlgorithmData: builder.query<AlgorithmResponse, { algorithmType: string; startTeam?: string }>({
            query: ({ algorithmType, startTeam }) => {
                const params = new URLSearchParams();
                if (startTeam) {
                    params.append('startTeam', startTeam);
                }
                const queryString = params.toString();
                return `/${algorithmType.toLowerCase()}${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ['Algorithm'],
        }),

        //custom route endpoint
        calculateCustomRoute: builder.mutation<CustomRouteResponse, CustomRouteRequest>({
            query: (body) => ({
                url: '/custom-route',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Algorithm'],
        }),
    }),
});

export const { useGetAlgorithmDataQuery, useCalculateCustomRouteMutation } = algorithmApi;