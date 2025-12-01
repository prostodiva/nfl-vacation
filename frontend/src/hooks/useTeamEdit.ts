// hooks/useTeamEdit.ts
import { useUpdateTeamMutation } from '../store/apis/teamsApi';
import { teamFields } from '../config/formFields';
import type { Team } from '../store/types/teamTypes';
import { useEntityEdit } from './useEntityEdit';
import { useDeleteTeamMutation } from '../store/apis/teamsApi';

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

export function useDeleteTeam() {
  const [deleteTeamMutation, { isLoading, error }] = useDeleteTeamMutation();

  const deleteTeam = async (teamId: string) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      await deleteTeamMutation(teamId).unwrap();
      console.log('Team deleted successfully');
      return { success: true };
    } catch (err: any) {
      console.error('Failed to delete team:', err);
      alert(`Failed to delete team: ${err.data?.message || 'Unknown error'}`);
      return { success: false, error: err };
    }
  };

  return { deleteTeam, isLoading, error };
}