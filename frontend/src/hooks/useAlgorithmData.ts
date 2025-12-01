/**
 * @fileoverview Custom hook for fetching and managing algorithm data
 * @module useAlgorithmData
 */

import { useGetAlgorithmDataQuery } from '../store/apis/algorithmApi';

/**
 * Custom hook for fetching algorithm execution results
 * Handles querying algorithm data based on algorithm type
 * 
 * @param {string | null} algorithmType - Type of algorithm to fetch data for
 *   Valid values: 'DFS', 'BFS', 'DIJKSTRA', 'A*', 'kruskal'
 * @returns {Object} Algorithm data and loading/error states
 * @returns {AlgorithmData | null} returns.data - Algorithm result data or null if not loaded
 * @returns {boolean} returns.isLoading - Whether the query is currently loading
 * @returns {string | null} returns.error - Error message if query failed, null otherwise
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAlgorithmData('DFS');
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error} />;
 * return <Map data={data} />;
 * ```
 */
export function useAlgorithmData(algorithmType: string | null) {
    const { data, isLoading, isError, error } = useGetAlgorithmDataQuery(
        algorithmType ? { algorithmType } : { algorithmType: '' },
        { skip: !algorithmType } 
    );

    return {
        data: data?.data || null,
        isLoading,
        error: isError ? (error as any)?.message || 'An error occurred' : null
    };
}