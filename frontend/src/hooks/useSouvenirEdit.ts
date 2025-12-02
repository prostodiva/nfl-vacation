// hooks/useSouvenirEdit.ts
import { useState } from 'react';
import { souvenirFields } from '../config/formFields';
import { useCreateSouvenirMutation, useDeleteSouvenirMutation, useUpdateSouvenirMutation } from '../store/apis/souvenirsApi';
import type { Souvenir } from '../store/types/teamTypes';

export function useSouvenirEdit() {
  const [editingItem, setEditingItem] = useState<Souvenir | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [updateSouvenir, { isLoading, error }] = useUpdateSouvenirMutation();
  const [createSouvenir, { isLoading: isCreatingLoading }] = useCreateSouvenirMutation();
  const [deleteSouvenir, { isLoading: isDeleting }] = useDeleteSouvenirMutation();

  const handleEdit = (item: Souvenir) => {
    console.log('Editing souvenir:', item);
    setEditingItem(item);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingItem({} as Souvenir); // Empty object for new souvenir
    setIsCreating(true);
  };

  const handleSave = async (updatedData: Partial<Souvenir & { teamId?: string }>) => {
    // If creating new souvenir
    if (isCreating) {
      const { teamId, ...souvenirData } = updatedData;
      
      if (!teamId) {
        alert('Please select a team');
        return;
      }

      try {
        await createSouvenir({
          teamId: teamId as string,
          souvenir: {
            name: souvenirData.name as string,
            price: souvenirData.price as number,
            category: souvenirData.category as string,
            isTraditional: souvenirData.isTraditional ?? true
          }
        }).unwrap();
        
        console.log('Souvenir created successfully');
        setEditingItem(null);
        setIsCreating(false);
      } catch (err: any) {
        console.error('Failed to create souvenir:', err);
        alert(`Failed to create souvenir: ${err.data?.message || 'Unknown error'}`);
      }
      return;
    }

    // If updating existing souvenir
    if (!editingItem?._id) {
      console.error('No souvenir ID found');
      return;
    }

    console.log('Saving souvenir ID:', editingItem._id);
    console.log('Update data:', updatedData);

    try {
      const { _id, teamName: _, stadiumName: __, teamId: ___, ...cleanData } = updatedData;
      
      console.log('Clean data being sent:', cleanData);

      const result = await updateSouvenir({
        id: editingItem._id,
        souvenir: cleanData
      }).unwrap();
      
      console.log('Update successful:', result);
      setEditingItem(null);
      setIsCreating(false);
    } catch (err: any) {
      console.error('Failed to update souvenir:', err);
      
      if (err.status === 404) {
        alert('This souvenir has been deleted and no longer exists.');
        setEditingItem(null);
      } else {
        alert(`Failed to update souvenir: ${err.data?.message || 'Unknown error'}`);
      }
    }
  };

  const handleClose = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleDelete = async (souvenirId: string) => {
    if (!window.confirm('Are you sure you want to delete this souvenir?')) {
      return;
    }

    try {
      await deleteSouvenir(souvenirId).unwrap();
      console.log('Souvenir deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete souvenir:', err);
      alert(`Failed to delete souvenir: ${err.data?.message || 'Unknown error'}`);
    }
  };

  return {
    editingItem,
    isCreating,
    isLoading: isLoading || isDeleting || isCreatingLoading,
    error,
    fields: souvenirFields,
    handleEdit,
    handleCreate,
    handleSave,
    handleClose,
    handleDelete
  };
}