import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateStadiumRequest, SingleStadiumResponse, StadiumResponse, StadiumsByRoofTypeResponse, UpdateStadiumRequest } from '../types/teamTypes';
import { API_BASE_URL } from '../../config/api';


export const stadiumApi = createApi({
  reducerPath: 'stadiumApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  }),
  tagTypes: ['StadiumItem'],
  endpoints: (builder) => ({


    getStadiumsByRoofType: builder.query<StadiumsByRoofTypeResponse, 'Open' | 'Fixed' | 'Retractable'>({
      query: (roofType) =>  `/roof?roofType=${roofType}`, //GET /api/stadiums/open-roof
      providesTags: ['StadiumItem']
    }),

    //get all stadiums
    getAllStadiums: builder.query<StadiumResponse, void>({
      query: () => '/all-stadiums', // GET /api/stadiums/all-stadiums
      providesTags: ['StadiumItem'],
    }),

    // POST - Create stadium
     createStadium: builder.mutation<SingleStadiumResponse, CreateStadiumRequest>({
      query: ({ stadium }) => ({ // Remove teamId from destructure
        url: '/', // POST /api/stadiums/
        method: 'POST',
        body: stadium,
      }),
      invalidatesTags: ['StadiumItem'],
    }),

    // PUT - Update stadium 
    updateStadium: builder.mutation<SingleStadiumResponse, { id: string, stadium: UpdateStadiumRequest }>({
      query: ({ id, stadium }) => ({ 
        url: `/${id}`, // PUT /api/stadiums/:id
        method: 'PUT',
        body: stadium,
      }),
      invalidatesTags: ['StadiumItem'],
    }),


     // DELETE - Delete stadium
    deleteStadium: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ 
        url: `/${id}`, // DELETE /api/stadiums/:id
        method: 'DELETE',
      }),
      invalidatesTags: ['StadiumItem'],
    }),
  }),
});

export const { useGetStadiumsByRoofTypeQuery,
  useGetAllStadiumsQuery, 
  useCreateStadiumMutation,
  useUpdateStadiumMutation,
  useDeleteStadiumMutation, } = stadiumApi;