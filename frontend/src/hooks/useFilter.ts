/**
 * @fileoverview Custom hook for filtering data based on multiple filter configurations
 * @module useFilter
 */

import { useMemo, useState } from "react";

/**
 * Configuration for a single filter
 * @template T - Type of items being filtered
 */
interface FilterConfig<T> {
    /** Unique key identifying this filter */
    key: string;
    /** Function to extract the value to filter on from an item */
    getValue: (item: T) => string | number | boolean;
}

/**
 * Custom hook for filtering an array of data based on multiple filter configurations
 * 
 * @template T - Type of items in the data array
 * @param {T[]} data - Array of data to filter
 * @param {FilterConfig<T>[]} filterConfigs - Array of filter configurations
 * @returns {Object} Filter state and functions
 * @returns {Record<string, string | number | boolean>} returns.filters - Current filter values
 * @returns {T[]} returns.filteredData - Filtered data array
 * @returns {(key: string, value: string | number | boolean) => void} returns.setFilter - Function to set a filter value
 * @returns {(key: string) => void} returns.clearFilter - Function to clear a specific filter
 * @returns {() => void} returns.clearAllFilters - Function to clear all filters
 * @returns {boolean} returns.hasActiveFilters - Whether any filters are currently active
 * 
 * @example
 * ```tsx
 * const { filteredData, setFilter, clearAllFilters } = useFilter(teams, [
 *   { key: 'conference', getValue: (team) => team.conference },
 *   { key: 'division', getValue: (team) => team.division }
 * ]);
 * ```
 * 
 * @timeComplexity O(n * m) where n = data length, m = number of active filters
 */
export function useFilter<T>(data: T[], filterConfigs: FilterConfig<T>[]) {
    const [filters, setFilters] = useState<Record<string, string | number | boolean>>({});

    const setFilter = (key: string, value: string | number | boolean) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilter = (key: string) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setFilters({});
    };

    const filteredData = useMemo(() => {
        let result = [...data];

        filterConfigs.forEach(config => {
            const filterValue = filters[config.key];
            if (filterValue !== undefined && filterValue !== null) {
                result = result.filter(item =>
                    config.getValue(item) === filterValue
                );
            }
        });

        return result;
    }, [data, filters, filterConfigs]);

    const hasActiveFilters = Object.keys(filters).length > 0;

    return {
        filters,
        filteredData,
        setFilter,
        clearFilter,
        clearAllFilters,
        hasActiveFilters,
    };
}