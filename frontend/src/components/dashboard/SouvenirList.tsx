import { useMemo } from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import { useGetAllSouvenirsQuery } from '../../store/apis/souvenirsApi';
import type { Souvenir } from '../../store/types/teamTypes';
import SouvenirCard from '../SouvenirCard';

interface SouvenirsListProps {
    souvenirs?: Souvenir[];
    teamName?: string;
    stadiumName?: string;
    isLoading?: boolean;
    // Admin mode
    isAdmin?: boolean;
    onEdit?: (souvenir: Souvenir) => void;
    onDelete?: (souvenirId: string) => void;
    // Shopping mode
    showAddToCart?: boolean;
    onAddToCart?: (souvenirId: string) => void;
    // Display options
    compact?: boolean;
    maxItems?: number;
    showTitle?: boolean;
    title?: string;
    // Styling
    variant?: 'admin' | 'shopping' | 'trip';
}

function SouvenirsList({ 
    souvenirs: providedSouvenirs,
    teamName,
    stadiumName,
    isLoading: providedIsLoading = false,
    isAdmin = false,
    onEdit,
    onDelete,
    showAddToCart = false,
    onAddToCart,
    maxItems,
    showTitle = true,
    title,
    variant = 'admin'
}: SouvenirsListProps) {
    // If souvenirs are provided, use them; otherwise fetch from API
    const { data: souvenirsData, isLoading: apiIsLoading } = useGetAllSouvenirsQuery(
        undefined,
        { skip: !!providedSouvenirs } // Skip API call if souvenirs are provided
    );

    const isLoading = providedSouvenirs ? providedIsLoading : apiIsLoading;

    // Filter and sort souvenirs based on props
    const filteredSouvenirs = useMemo(() => {
        // Create a copy of the array to avoid mutating read-only arrays from RTK Query
        const sourceArray = providedSouvenirs || souvenirsData?.data || [];
        let filtered: Souvenir[] = [...sourceArray];
        
        // Filter by team if specified
        if (teamName) {
            filtered = filtered.filter(s => s.teamName === teamName);
        }
        
        // Filter by stadium if specified
        if (stadiumName) {
            filtered = filtered.filter(s => s.stadiumName === stadiumName);
        }
        
        // Sort by stadium name in admin mode
        if (isAdmin) {
            filtered = filtered.sort((a, b) => {
                const stadiumA = a.stadiumName || '';
                const stadiumB = b.stadiumName || '';
                return stadiumA.localeCompare(stadiumB);
            });
        }
        
        // Limit items if specified
        if (maxItems) {
            filtered = filtered.slice(0, maxItems);
        }
        
        return filtered;
    }, [providedSouvenirs, souvenirsData, teamName, stadiumName, maxItems, isAdmin]);

    // Loading state
    if (isLoading) {
        return (
            <div className={`text-center py-8 ${variant === 'admin' ? 'text-white' : 'text-gray-500'}`}>
                Loading souvenirs...
            </div>
        );
    }

    // Empty state
    if (!filteredSouvenirs || filteredSouvenirs.length === 0) {
        return (
            <div className={`text-center py-8 ${variant === 'admin' ? 'text-white' : 'text-gray-500'} bg-[#3b3c5e] rounded-md`}>
                <FiShoppingBag className="inline-block mr-2 opacity-50" />
                No souvenirs found.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {showTitle && (
                <h2 className={`text-2xl font-bold mb-4 ${variant === 'admin' ? 'text-white' : 'text-gray-800'}`}>
                    {title || `Souvenirs (${filteredSouvenirs.length})`}
                </h2>
            )}
            <div className="space-y-2">
                {filteredSouvenirs.map((souvenir) => (
                    <SouvenirCard
                        key={souvenir._id}
                        souvenir={souvenir}
                        isAdmin={isAdmin}
                        onEdit={onEdit ? () => onEdit(souvenir) : undefined}
                        onDelete={onDelete ? () => onDelete(souvenir._id) : undefined}
                        showAddToCart={showAddToCart}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
        </div>
    );
}

export default SouvenirsList;