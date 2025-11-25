import { useState } from 'react';
import type { FieldConfig } from '../components/dashboard/EditModel';

interface UseEntityEditConfig<T, TUpdate> {
  fields: FieldConfig[];
  updateMutation: any; // RTK Query mutation hook
  transformData: (data: Partial<T>) => TUpdate; // Transform form data to API format
}

export function useEntityEdit<T extends { _id: string }, TUpdate>({
  fields,
  updateMutation,
  transformData
}: UseEntityEditConfig<T, TUpdate>) {
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [updateItem, { isLoading, error }] = updateMutation();

  const handleSave = async (updatedData: Partial<T>) => {
    if (!editingItem?._id) return;

    try {
      const transformedData = transformData(updatedData);
      
      const result = await updateItem({
        id: editingItem._id,
        ...transformedData  
      }).unwrap();
      
      setEditingItem(null);
    } catch (error: any) {
      if (error.status === 400) {
        console.error('Bad request - validation failed:', error.data);
        alert(`Failed to save: ${error.data?.message || 'Invalid data'}`);
      } else {
        console.error('Failed to update:', error);
        alert('An error occurred while saving');
      }
    }
  };

  const handleClose = () => setEditingItem(null);

  return {
    editingItem,
    isLoading,
    error,
    fields,
    handleEdit: (item: T) => setEditingItem(item),
    handleSave,
    handleClose
  };
}