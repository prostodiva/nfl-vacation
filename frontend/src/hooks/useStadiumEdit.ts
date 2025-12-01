// hooks/useStadiumEdit.ts
import { useUpdateStadiumMutation } from '../store/apis/stadiumsApi';
import { stadiumFields } from '../config/formFields';
import type { StadiumItem } from '../store/types/teamTypes';
import { useEntityEdit } from './useEntityEdit';
import { useDeleteStadiumMutation } from '../store/apis/stadiumsApi';

export function useStadiumEdit() {
  return useEntityEdit<StadiumItem, any>({
    fields: stadiumFields,
    updateMutation: useUpdateStadiumMutation,
    transformData: (data) => ({
      stadium: {
        name: data.stadiumName,
        location: data.location,
        seatingCapacity: data.seatingCapacity,
        surfaceType: data.surfaceType,
        roofType: data.roofType,
        yearOpened: data.yearOpened
      }
    })
  });
}

export function useDeleteStadium() {
  const [deleteStadiumMutation, { isLoading, error }] = useDeleteStadiumMutation();

  const deleteStadium = async (stadiumId: string) => {
    if (!window.confirm('Are you sure you want to delete this stadium?')) {
      return;
    }

    try {
      await deleteStadiumMutation(stadiumId).unwrap();
      console.log('Stadium deleted successfully');
      return { success: true };
    } catch (err: any) {
      console.error('Failed to delete stadium:', err);
      alert(`Failed to delete stadium: ${err.data?.message || 'Unknown error'}`);
      return { success: false, error: err };
    }
  };

  return { deleteStadium, isLoading, error };
}

