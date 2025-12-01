/**
 * @fileoverview Custom hook for managing entity editing in admin dashboard
 * @module useEntityEdit
 */

import { useState } from 'react';
import type { FieldConfig } from '../components/dashboard/EditModel';

/**
 * Configuration for entity editing hook
 * @template T - Type of entity being edited (must have _id)
 * @template TUpdate - Type of update payload for API
 */
interface UseEntityEditConfig<T, TUpdate> {
  /** Field configurations for the edit form */
  fields: FieldConfig[];
  /** RTK Query mutation hook for updating the entity */
  updateMutation: any;
  /** Function to transform form data to API format */
  transformData: (data: Partial<T>) => TUpdate;
}

/**
 * Custom hook for managing entity editing operations
 * Provides state and handlers for editing entities in admin dashboard
 * 
 * @template T - Type of entity being edited (must have _id property)
 * @template TUpdate - Type of update payload for API
 * @param {UseEntityEditConfig<T, TUpdate>} config - Configuration object
 * @returns {Object} Editing state and handlers
 * @returns {T | null} returns.editingItem - Currently editing item or null
 * @returns {boolean} returns.isLoading - Whether update is in progress
 * @returns {any} returns.error - Error from update mutation
 * @returns {FieldConfig[]} returns.fields - Field configurations
 * @returns {(item: T) => void} returns.handleEdit - Function to start editing an item
 * @returns {(updatedData: Partial<T>) => Promise<void>} returns.handleSave - Function to save changes
 * @returns {() => void} returns.handleClose - Function to close edit modal
 * 
 * @example
 * ```tsx
 * const team = useEntityEdit({
 *   fields: teamFields,
 *   updateMutation: useUpdateTeamMutation,
 *   transformData: (data) => ({ teamName: data.teamName, ... })
 * });
 * 
 * <button onClick={() => team.handleEdit(selectedTeam)}>Edit</button>
 * ```
 */
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
      
      await updateItem({
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