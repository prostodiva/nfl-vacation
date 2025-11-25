// hooks/useStadiumEdit.ts
import { useUpdateStadiumMutation } from '../store/apis/stadiumsApi';
import { stadiumFields } from '../config/formFields';
import type { StadiumItem } from '../store/types/teamTypes';
import { useEntityEdit } from './useEntityEdit';

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