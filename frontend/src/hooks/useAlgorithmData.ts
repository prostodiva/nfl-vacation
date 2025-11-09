import { useGetAlgorithmDataQuery } from '../store/apis/algorithmApi';

export function useAlgorithmData(algorithmType: string | null) {
    const { data, isLoading, isError, error } = useGetAlgorithmDataQuery(
        algorithmType || '',
        { skip: !algorithmType } 
    );

    return {
        data: data?.data || null,
        isLoading,
        error: isError ? (error as any)?.message || 'An error occurred' : null
    };
}