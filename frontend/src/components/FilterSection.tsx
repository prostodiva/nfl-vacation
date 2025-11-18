import { useState } from 'react';
import Dropdown, { type DropdownOption } from './Dropdown';
import TeamCard from "./TeamCard";
import { useMemo } from "react";
import { useGetAllTeamsQuery } from "../store/apis/teamsApi";
import { useFilter } from "../hooks/useFilter";
import type { FilterConfig } from "../config/filterConfigs.ts";
import Skeleton from "./Skeleton";
import type {Team} from "../store/types/teamTypes.ts";

interface FilterSectionProps {
    filters: FilterConfig[];
    title?: string;
    enableSorting?: boolean;
}

function FilterSection({ filters, enableSorting = false }: FilterSectionProps) {
    const { data, isLoading, isError } = useGetAllTeamsQuery();
    const teams = data?.data || [];

    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    // Generate filter config from definitions
    const filterConfig = useMemo(() =>
            filters.map(f => ({
                key: f.key,
                getValue: f.getValue
            })),
        [filters]
    );

    const {
        filters: activeFilters,
        filteredData: filteredTeams,
        setFilter,
        clearAllFilters,
        hasActiveFilters
    } = useFilter(teams, filterConfig);

     const sortedAndFilteredTeams = useMemo(() => {
        if (!sortBy || !sortOrder) return filteredTeams; 

        return [...filteredTeams].sort((a, b) => {
            let valueA: number;
            let valueB: number;

            if (sortBy === 'yearOpened') {
                valueA = a.stadium.yearOpened;
                valueB = b.stadium.yearOpened;
            } else if (sortBy === 'capacity') {
                valueA = a.stadium.seatingCapacity;
                valueB = b.stadium.seatingCapacity;
            } else {
                return 0;
            }
            
            return sortOrder === 'asc' 
                ? valueA - valueB
                : valueB - valueA;
        });
    }, [filteredTeams, sortBy, sortOrder]);

    const uniqueStadiumCount = useMemo(() => {
        const stadiumNames = new Set(filteredTeams.map(team => team.stadium.name));
        return stadiumNames.size;
    }, [sortedAndFilteredTeams]); 

    const totalUniqueCapacity = useMemo(() => {
        const uniqueStadiums = new Map<string, Team>();
        
        sortedAndFilteredTeams.forEach(team => {
            const stadiumName = team.stadium.name;
            if (!uniqueStadiums.has(stadiumName)) {
                uniqueStadiums.set(stadiumName, team);
            }
        });
        
        return Array.from(uniqueStadiums.values())
            .reduce((total, team) => total + team.stadium.seatingCapacity, 0);
    }, [sortedAndFilteredTeams]);

    const dropdownOptions = useMemo(() => {
        return filters.reduce((acc, filter) => {
            acc[filter.key] = filter.getOptions(teams);
            return acc;
        }, {} as Record<string, DropdownOption[]>);
    }, [teams, filters]);

    const sortOptions: DropdownOption[] = [
        { value: 'none', label: 'No sorting' },
        { value: 'yearOpened-asc', label: 'Oldest first (1924→2023)' },
        { value: 'yearOpened-desc', label: 'Newest first (2023→1924)' },
        { value: 'capacity-asc', label: 'Capacity: Smallest first' },
        { value: 'capacity-desc', label: 'Capacity: Largest first' }
    ];

    const getCurrentSortValue = () => {
        if (!sortBy) return 'none';
        return `${sortBy}-${sortOrder}`;
    };

     const selectedSortOption = sortOptions.find(opt => 
        opt.value === getCurrentSortValue()
    ) || sortOptions[0];

    const getSelectedOption = (filterKey: string) => {
        const options = dropdownOptions[filterKey];
        return options?.find(opt => opt.value === activeFilters[filterKey]) || null;
    };

    const handleSortChange = (option: DropdownOption) => {
        if (option.value === 'none') {
            setSortBy(null);
            setSortOrder(null);
        } else {
            const [field, order] = option.value.split('-');
            setSortBy(field);
            setSortOrder(order as 'asc' | 'desc');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center space-y-6 w-full">
                {<Skeleton times={1} className="h-8 w-48" />}

                {/* Dropdown skeletons */}
                <div className="flex items-center gap-6 flex-wrap">
                    <Skeleton times={filters.length} className="h-12 w-64" />
                </div>

                {/* Card skeletons */}
                <div className="w-full max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Skeleton times={6} className="h-48 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error loading teams</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-6 w-full">

            {/* Dynamic Dropdowns */}
            <div className="flex items-center gap-4 flex-wrap">
                {filters.map(filter => (
                    <Dropdown
                        key={filter.key}
                        options={dropdownOptions[filter.key]}
                        value={getSelectedOption(filter.key)}
                        onChange={(opt) => setFilter(filter.key, opt.value)}
                        placeholder={filter.placeholder}
                        className="w-54"
                    />
                ))}
            </div>

             {enableSorting && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <Dropdown
                        options={sortOptions}
                        value={selectedSortOption}
                        onChange={handleSortChange}  
                        placeholder="Sort order..."
                        className="w-64"
                    />
                </div>
            )}

            {/* Clear Filters Button */}
           {(hasActiveFilters || sortBy) && (
                <button
                    onClick={() => {
                        clearAllFilters();
                        setSortBy(null);
                        setSortOrder(null); 
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                >
                    Clear All Filters & Sorting
                </button>
            )}

            {/* Results Count */}
             <div className="text-gray-600 text-center space-y-1">
                <p className="text-lg font-semibold">
                    {uniqueStadiumCount} unique stadium{uniqueStadiumCount !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-500">
                    ({sortedAndFilteredTeams.length} team{sortedAndFilteredTeams.length !== 1 ? 's' : ''})
                </p>
            </div>

            <div className="text-gray-600 text-center space-y-1">
                <h1>Total unique capacity</h1>
                <p className="text-lg font-semibold">
                    {totalUniqueCapacity}
                </p>
            </div>

            {/* Display Filtered Teams */}
             <div className="w-full max-w-6xl">
                {sortedAndFilteredTeams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                        {sortedAndFilteredTeams.map(team => (
                            <TeamCard key={team._id} team={team} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        No teams match the selected filters
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterSection;