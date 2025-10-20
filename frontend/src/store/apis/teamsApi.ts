import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Team } from '../types/teamTypes';

// Response types
interface TeamResponse {
  success: boolean;
  data: Team;
}

interface TeamsResponse {
  success: boolean;
  count: number;
  data: Team[];
}

export const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/teams',
  }),
  tagTypes: ['Team'],
  endpoints: (builder) => ({
    //get all teams
    getAllTeams: builder.query<TeamsResponse, void>({
      query: () => '/', // GET /api/teams
      providesTags: ['Team'],
    }),
    // Get team by ID
    getTeamById: builder.query<TeamResponse, string>({
      query: (teamId) => `/${teamId}`, // GET /api/teams/:id
      providesTags: (result, error, teamId) => [{ type: 'Team', id: teamId }],
    }),
  }),
});

export const { useGetAllTeamsQuery, useGetTeamByIdQuery } = teamsApi;
