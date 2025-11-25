// hooks/useTeamEdit.ts
import { useUpdateTeamMutation } from '../store/apis/teamsApi';
import { teamFields } from '../config/formFields';
import type { Team } from '../store/types/teamTypes';
import { useEntityEdit } from './useEntityEdit';

export function useTeamEdit() {
  return useEntityEdit<Team, any>({
    fields: teamFields,
    updateMutation: useUpdateTeamMutation,
    transformData: (data) => {
      console.log('useTeamEdit - Raw form data:', data);
      const transformed = {
        teamName: data.teamName,
        conference: data.conference,
        division: data.division
      };
      console.log('useTeamEdit - Transformed data:', transformed);
      return transformed;
    }
  });
}