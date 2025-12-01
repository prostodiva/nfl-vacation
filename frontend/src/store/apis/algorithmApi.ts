import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AlgorithmData, CustomRouteRequest, CustomRouteResponse, RecursiveRouteResponse } from '../types/algorithmTypes';

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
        //DFS/BFS/dijkstra/A/kruskal
        getAlgorithmData: builder.query<AlgorithmResponse, { algorithmType: string; startTeam?: string; endTeam?: string }>({
            query: ({ algorithmType, startTeam, endTeam }) => {
                // Map algorithm types to URL-safe route names
                const routeMap: Record<string, string> = {
                    'DFS': 'dfs',
                    'BFS': 'bfs',
                    'DIJKSTRA': 'dijkstra',
                    'A*': 'astar',
                    'kruskal': 'kruskal'
                };
                const route = routeMap[algorithmType] || algorithmType.toLowerCase();
                const params = new URLSearchParams();
                if (startTeam) {
                    params.append('startTeam', startTeam);
                }
                if (endTeam) {
                    params.append('endTeam', endTeam);
                }
                const queryString = params.toString();
                return `/${route}${queryString ? `?${queryString}` : ''}`;
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

      //recursive route endpoint
        calculateRecursiveRoute: builder.mutation<RecursiveRouteResponse, void>({
            query: () => ({
                url: '/recursive',
                method: 'POST',
            }),
            invalidatesTags: ['Algorithm'],
        })
    }),
});

export const { useGetAlgorithmDataQuery, useCalculateCustomRouteMutation, useCalculateRecursiveRouteMutation } = algorithmApi;