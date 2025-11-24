import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { StadiumsByRoofTypeResponse, StadiumItem } from '../types/teamTypes';

// Response types
interface StadiumResponse {
  success: boolean;
  data: StadiumItem[];
}

export const stadiumApi = createApi({
  reducerPath: 'stadiumApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/stadiums',
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
  }),
});

export const { useGetStadiumsByRoofTypeQuery , useGetAllStadiumsQuery } = stadiumApi;