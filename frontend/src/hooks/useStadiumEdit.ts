// hooks/useStadiumEdit.ts
import { useState } from 'react';
import { useUpdateStadiumMutation } from '../store/apis/stadiumsApi';
import { stadiumFields } from '../config/formFields';
import type { StadiumItem } from '../store/types/teamTypes';

export function useStadiumEdit() {
    const [editingStadium, setEditingStadium] = useState<StadiumItem | null>(null);
    const [updateStadium, { isLoading }] = useUpdateStadiumMutation();

    const handleEdit = (stadium: StadiumItem) => {
        setEditingStadium(stadium);
    };

    const handleSave = async (updatedData: Partial<StadiumItem>) => {
        if (!editingStadium?._id) return;

        try {
            await updateStadium({
                id: editingStadium._id,
                stadium: {
                    name: updatedData.stadiumName,
                    location: updatedData.location,
                    seatingCapacity: updatedData.seatingCapacity,
                    surfaceType: updatedData.surfaceType,
                    roofType: updatedData.roofType,
                    yearOpened: updatedData.yearOpened
                }
            }).unwrap();
            
            setEditingStadium(null);
        } catch (error: any) {
            // Error handling
            if (error.status === 400) {
                console.error('Bad request - validation failed:', error.data);
                // Show error message to user
                alert(`Failed to save: ${error.data?.message || 'Invalid data'}`);
            } else {
                console.error('Failed to update stadium:', error);
                alert('An error occurred while saving');
            }
        }
    };

    const handleClose = () => setEditingStadium(null);

    return {
        editingStadium,
        isLoading,
        fields: stadiumFields,
        handleEdit,
        handleSave,
        handleClose
    };
}