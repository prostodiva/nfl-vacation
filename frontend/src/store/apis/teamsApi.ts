import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Team } from '../types/teamTypes';

interface TeamsResponse {
  success: boolean;
  count: number;
  data: Team[];
}

interface SingleTeamResponse {
  success: boolean;
  data: Team;
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
      query: () => '/team-by-stadiums', // GET /api/teams/team-by-stadiums
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
    getTeamById: builder.query<TeamsResponse, string>({
      query: (teamId) => `/${teamId}`, // GET /api/teams/:id
      providesTags: (result, error, teamId) => [{ type: 'Team', id: teamId }],
    }),

    // store/apis/teamsApi.ts
    updateTeam: builder.mutation<SingleTeamResponse, { id: string; teamName: string; conference: string; division: string }>({
      query: (payload) => {
        console.log('teamsApi - updateTeam query payload:', payload);
        
        const { id, ...teamData } = payload;
        console.log('teamsApi - Team ID:', id);
        console.log('teamsApi - Team data:', teamData);
        
        return {
          url: `/${id}`,
          method: 'PUT',
          body: teamData,
        };
      },
      invalidatesTags: ['Team'],
    }),

    // delete team
    deleteTeam: builder.mutation<{ success: boolean; message: string }, string> ({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
  }), 
});

export const { useGetAllTeamsQuery, useGetTeamsByStadiumsQuery, useGetAllTeamsByConferenceQuery, useGetTeamsByConferenceQuery, useGetTeamByIdQuery, useUpdateTeamMutation, useDeleteTeamMutation  } = teamsApi;
