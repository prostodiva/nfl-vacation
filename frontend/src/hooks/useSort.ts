import { useCallback, useMemo, useState } from 'react';

export interface UseSortReturn {
  sortBy: string | null;
  sortOrder: 'asc' | 'desc' | null;
  setSort: (field: string | null, order: 'asc' | 'desc' | null) => void;
  setSortFromOption: (optionValue: string) => void;
  getSortValue: () => string;
  clearSort: () => void;
  isSorted: boolean;
}

/**
 * Custom hook for managing sort state
 * @returns Object with sort state and helper functions
 */
export function useSort(): UseSortReturn {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  /**
   * Set sort field and order together
   */
  const setSort = useCallback((field: string | null, order: 'asc' | 'desc' | null) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  /**
   * Set sort from a dropdown option value (e.g., "yearOpened-asc" or "none")
   */
  const setSortFromOption = useCallback((optionValue: string) => {
    if (optionValue === 'none') {
      setSortBy(null);
      setSortOrder(null);
    } else {
      const [field, order] = optionValue.split('-');
      setSortBy(field);
      setSortOrder(order as 'asc' | 'desc');
    }
  }, []);

  /**
   * Get the combined sort value (e.g., "yearOpened-asc")
   */
  const getSortValue = useCallback(() => {
    if (!sortBy || !sortOrder) return 'none';
    return `${sortBy}-${sortOrder}`;
  }, [sortBy, sortOrder]);

  /**
   * Clear sort state
   */
  const clearSort = useCallback(() => {
    setSortBy(null);
    setSortOrder(null);
  }, []);

  /**
   * Check if sorting is active
   */
  const isSorted = useMemo(() => {
    return sortBy !== null && sortOrder !== null;
  }, [sortBy, sortOrder]);

  return {
    sortBy,
    sortOrder,
    setSort,
    setSortFromOption,
    getSortValue,
    clearSort,
    isSorted,
  };
}
