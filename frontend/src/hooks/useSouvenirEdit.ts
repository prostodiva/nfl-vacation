// hooks/useSouvenirEdit.ts
import { useState } from 'react';
import { useUpdateSouvenirMutation } from '../store/apis/souvenirsApi';
import { souvenirFields } from '../config/formFields';
import type { Souvenir } from '../store/types/teamTypes';

// hooks/useSouvenirEdit.ts
export function useSouvenirEdit() {
  const [editingItem, setEditingItem] = useState<Souvenir | null>(null);
  const [updateSouvenir, { isLoading, error }] = useUpdateSouvenirMutation();

  const handleEdit = (item: Souvenir) => {
    console.log('Editing souvenir:', item);
    setEditingItem(item);
  };

  const handleSave = async (updatedData: Partial<Souvenir>) => {
  if (!editingItem?._id) {
    console.error('No souvenir ID found');
    return;
  }

  console.log('Saving souvenir ID:', editingItem._id);
  console.log('Update data:', updatedData);

  try {
    const { _id, teamName: _, stadiumName: __, ...cleanData } = updatedData;
    
    console.log('Clean data being sent:', cleanData);

    const result = await updateSouvenir({
      id: editingItem._id,
      souvenir: cleanData
    }).unwrap();
    
    console.log('Update successful:', result);
    setEditingItem(null);
  } catch (err: any) {
    console.error('Failed to update souvenir:', err);
    
    // Handle 404 specifically - the souvenir was deleted
    if (err.status === 404) {
      alert('This souvenir has been deleted and no longer exists.');
      setEditingItem(null); // Close the modal
      // The cache will be refreshed automatically due to invalidatesTags
    } else {
      // Handle other errors
      alert(`Failed to update souvenir: ${err.data?.message || 'Unknown error'}`);
    }
    
    console.error('Error details:', {
      status: err.status,
      data: err.data,
      originalStatus: err.originalStatus
    });
  }
};

  const handleClose = () => setEditingItem(null);

  return {
    editingItem,
    isLoading,
    error,
    fields: souvenirFields,
    handleEdit,
    handleSave,
    handleClose
  };
}