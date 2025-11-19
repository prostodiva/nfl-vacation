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

    // Get all teams sorted by stadium name
    getTeamsByStadiums: builder.query<TeamsResponse, void>({
      query: () => '/stadiums', // GET /api/teams/stadiums
      providesTags: ['Team'],
    }),

    // Get all teams sorted by conference (AFC first, then NFC)
    getAllTeamsByConference: builder.query<TeamsResponse, void>({
      query: () => '/conference-sorted', // GET /api/teams/conference-sorted
      providesTags: ['Team'],
    }),

    // Get teams by specific conference (filtered)
    getTeamsByConference: builder.query<TeamsResponse, string>({
      query: (conference) => `/conference/${conference}`, // GET /api/teams/conference/:conference
      providesTags: ['Team'],
    }),

    // Get team by ID
    getTeamById: builder.query<TeamResponse, string>({
      query: (teamId) => `/${teamId}`, // GET /api/teams/:id
      providesTags: (result, error, teamId) => [{ type: 'Team', id: teamId }],
    }),
  }),
});

export const { useGetAllTeamsQuery, useGetTeamsByStadiumsQuery, useGetAllTeamsByConferenceQuery, useGetTeamsByConferenceQuery, useGetTeamByIdQuery } = teamsApi;
