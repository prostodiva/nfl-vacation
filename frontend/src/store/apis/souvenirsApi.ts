// store/apis/souvenirsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SouvenirsResponse, SingleSouvenirResponse, CreateSouvenirRequest, UpdateSouvenirRequest } from '../types/teamTypes';

// store/apis/souvenirsApi.ts
export const souvenirsApi = createApi({
  reducerPath: 'souvenirsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/souvenirs',
  }),
  tagTypes: ['Souvenir'],
  keepUnusedDataFor: 0, 
  endpoints: (builder) => ({
    getAllSouvenirs: builder.query<SouvenirsResponse, void>({
      query: () => '/all-souvenirs',
      providesTags: ['Souvenir'],
    }),

    // POST - Create souvenir
    createSouvenir: builder.mutation<SingleSouvenirResponse, CreateSouvenirRequest>({
      query: ({ teamId, souvenir }) => ({
        url: '/', // POST /api/souvenirs/
        method: 'POST',
        body: { teamId, souvenir },
      }),
      invalidatesTags: ['Souvenir'],
    }),

    // PUT - Update souvenir
    updateSouvenir: builder.mutation<SingleSouvenirResponse, UpdateSouvenirRequest>({
      query: ({ id, souvenir }) => ({
        url: `/${id}`, // PUT /api/souvenirs/:id
        method: 'PUT',
        body: souvenir,
      }),
      invalidatesTags: ['Souvenir'],
    }),

    // DELETE - Delete souvenir
    deleteSouvenir: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/${id}`, // DELETE /api/souvenirs/:id
        method: 'DELETE',
      }),
      invalidatesTags: ['Souvenir'],
    }),
  }),
});

export const {
  useGetAllSouvenirsQuery,
  useCreateSouvenirMutation,
  useUpdateSouvenirMutation,
  useDeleteSouvenirMutation,
} = souvenirsApi;