/**
 * @fileoverview FilterSection component - Advanced filtering and sorting for teams/stadiums
 * @module FilterSection
 */

import { useEffect, useMemo, useState } from 'react';
import type { FilterConfig } from "../config/filterConfigs.ts";
import { useFilter } from "../hooks/useFilter";
import { useGetStadiumsByRoofTypeQuery } from "../store/apis/stadiumsApi.ts";
import {
    useGetAllTeamsByConferenceQuery,
    useGetAllTeamsQuery,
    useGetTeamsByStadiumsQuery
} from "../store/apis/teamsApi";
import type { Team } from "../store/types/teamTypes.ts";
import Button from "./Button.tsx";
import Dropdown, { type DropdownOption } from './Dropdown';
import Skeleton from "./Skeleton";
import TeamCard from "./TeamCard";

interface FilterSectionProps {
    filters: FilterConfig[];
    enableSorting?: boolean;
    viewType?: 'teams' | 'stadiums';
}

// Constants moved outside component to avoid recreation
const SORT_OPTIONS: DropdownOption[] = [
    { value: 'none', label: 'No sorting' },
    { value: 'yearOpened-asc', label: 'Oldest first (1924→2023)' },
    { value: 'yearOpened-desc', label: 'Newest first (2023→1924)' },
    { value: 'capacity-asc', label: 'Capacity: Smallest first' },
    { value: 'capacity-desc', label: 'Capacity: Largest first' }
];

// Helper function moved outside component
const filterTeamsWithStadiums = (teams: Team[] | undefined): Team[] => {
    if (!teams) return [];
    return teams.filter(team => team.stadium != null);
};

function FilterSection({ filters, enableSorting = false, viewType = 'teams' }: FilterSectionProps) {
    // API Queries
    const { data: allTeamsData, isLoading: isLoadingAll, isError: isErrorAll } = useGetAllTeamsQuery();
    const { data: stadiumsData, isLoading: isLoadingStadiums } = useGetTeamsByStadiumsQuery(undefined, {
        skip: viewType !== 'stadiums'
    });
    const { data: conferenceData, isLoading: isLoadingConference } = useGetAllTeamsByConferenceQuery(undefined, {
        skip: viewType !== 'teams'
    });

    // State
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [sortByConference, setSortByConference] = useState<boolean>(false);
    const [showAllTeams, setShowAllTeams] = useState(false);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    // Roof type filter logic
    const roofTypeFilter = activeFilters['roofType'];
    const selectedRoofType = roofTypeFilter === 'Dome' 
        ? 'Fixed' as const
        : (roofTypeFilter as 'Open' | 'Fixed' | 'Retractable' | undefined);

    const { data: roofTypeData, isLoading: isLoadingRoofType } = useGetStadiumsByRoofTypeQuery(
        selectedRoofType as 'Open' | 'Fixed' | 'Retractable',
        { skip: !selectedRoofType || viewType !== 'stadiums' }
    );

    const isRoofTypeData = selectedRoofType && viewType === 'stadiums' && roofTypeData;

    // Loading state
    const isLoading = useMemo(() => {
        if (viewType === 'stadiums') {
            return isLoadingStadiums || (selectedRoofType ? isLoadingRoofType : false);
        }
        if (viewType === 'teams') {
            return isLoadingConference || isLoadingAll;
        }
        return isLoadingAll;
    }, [viewType, isLoadingStadiums, isLoadingConference, isLoadingAll, isLoadingRoofType, selectedRoofType]);

    // Data processing
    const teams = useMemo(() => {
        if (viewType === 'stadiums' && stadiumsData?.data) {
            return filterTeamsWithStadiums(stadiumsData.data);
        }
        if (viewType === 'teams' && conferenceData?.data) {
            return filterTeamsWithStadiums(conferenceData.data);
        }
        if (allTeamsData?.data) {
            return filterTeamsWithStadiums(allTeamsData.data);
        }
        return [];
    }, [viewType, stadiumsData, conferenceData, allTeamsData]);

    const filterConfig = useMemo(() =>
        filters.map(f => ({ key: f.key, getValue: f.getValue })),
        [filters]
    );

    const displayData = useMemo(() => {
        if (isRoofTypeData && roofTypeData) {
            return roofTypeData.data.map((stadium, index) => ({
                _id: `stadium-${index}`,
                teamName: stadium.teamName,
                conference: '' as any,
                division: '' as any,
                stadium: {
                    name: stadium.stadiumName,
                    location: stadium.location,
                    seatingCapacity: stadium.seatingCapacity,
                    surfaceType: stadium.surfaceType,
                    roofType: stadium.roofType,
                    yearOpened: stadium.yearOpened
                },
                souvenirs: []
            })) as Team[];
        }
        return teams;
    }, [isRoofTypeData, roofTypeData, teams]);

    const {
        filters: clientFilters,
        filteredData: finalFilteredData,
        setFilter: setClientFilter,
        clearAllFilters: clearClientFilters
    } = useFilter(displayData, filterConfig);

    // Sorting and filtering
    const sortedAndFilteredTeams = useMemo(() => {
        if (finalFilteredData.length === 0) {
            return [];
        }
        
        if (!sortBy || !sortOrder) {
            if (sortByConference) {
                return finalFilteredData;
            }
            if (viewType === 'stadiums') {
                return [...finalFilteredData].sort((a, b) =>
                    a.stadium.name.localeCompare(b.stadium.name)
                );
            }
            return [...finalFilteredData].sort((a, b) =>
                a.teamName.localeCompare(b.teamName)
            );
        }

        return [...finalFilteredData].sort((a, b) => {
            let valueA: number;
            let valueB: number;

            if (sortBy === 'yearOpened') {
                valueA = a.stadium.yearOpened;
                valueB = b.stadium.yearOpened;
            } else if (sortBy === 'capacity') {
                valueA = a.stadium.seatingCapacity;
                valueB = b.stadium.seatingCapacity;
            } else {
                return a.teamName.localeCompare(b.teamName);
            }

            return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        });
    }, [finalFilteredData, sortBy, sortOrder, sortByConference, viewType]);

    // Statistics
    const uniqueStadiumCount = useMemo(() => {
        const stadiumNames = new Set(finalFilteredData.map(team => team.stadium.name));
        return stadiumNames.size;
    }, [finalFilteredData]);

    const totalUniqueCapacity = useMemo(() => {
        const uniqueStadiums = new Map<string, Team>();
        sortedAndFilteredTeams.forEach((team: Team) => {
            const stadiumName = team.stadium.name;
            if (!uniqueStadiums.has(stadiumName)) {
                uniqueStadiums.set(stadiumName, team);
            }
        });
        return Array.from(uniqueStadiums.values())
            .reduce((total, team) => total + team.stadium.seatingCapacity, 0);
    }, [sortedAndFilteredTeams]);

    // Display logic
    const displayedTeams = useMemo(() => {
        if (sortedAndFilteredTeams.length === 0) {
            return [];
        }
        return showAllTeams ? sortedAndFilteredTeams : sortedAndFilteredTeams.slice(0, 3);
    }, [sortedAndFilteredTeams, showAllTeams]);
    
    const hasMoreTeams = sortedAndFilteredTeams.length > 3;

    // Dropdown options
    const dropdownOptions = useMemo(() => {
        return filters.reduce((acc, filter) => {
            acc[filter.key] = filter.getOptions(teams);
            return acc;
        }, {} as Record<string, DropdownOption[]>);
    }, [teams, filters]);

    // Handlers
    const getCurrentSortValue = () => {
        if (!sortBy) return 'none';
        return `${sortBy}-${sortOrder}`;
    };

    const selectedSortOption = SORT_OPTIONS.find(opt => 
        opt.value === getCurrentSortValue()
    ) || SORT_OPTIONS[0];

    const getSelectedOption = (filterKey: string) => {
        const options = dropdownOptions[filterKey];
        const value = filterKey === 'roofType' 
            ? activeFilters[filterKey]
            : clientFilters[filterKey];
        return options?.find(opt => opt.value === value) || null;
    };

    const handleFilterChange = (filterKey: string, value: string) => {
        if (filterKey === 'roofType') {
            setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
        } else {
            setClientFilter(filterKey, value);
        }
    };

    const handleSortChange = (option: DropdownOption) => {
        if (option.value === 'none') {
            setSortBy(null);
            setSortOrder(null);
        } else {
            const [field, order] = String(option.value).split('-');
            setSortBy(field);
            setSortOrder(order as 'asc' | 'desc');
        }
    };

    const handleClearFilters = () => {
        setActiveFilters({});
        clearClientFilters();
        setSortBy(null);
        setSortOrder(null);
        setSortByConference(false);
    };

    // Reset showAllTeams when filters change
    useEffect(() => {
        setShowAllTeams(false);
    }, [activeFilters, sortBy, sortOrder, sortByConference, viewType, finalFilteredData.length]);

    // Early returns
    if (isLoading) {
        return (
            <div className="flex flex-col items-center space-y-6 w-full">
                <Skeleton times={1} className="h-8 w-48" />
                <div className="flex items-center gap-6 flex-wrap">
                    <Skeleton times={filters.length} className="h-12 w-64" />
                </div>
                <div className="w-full max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Skeleton times={6} className="h-48 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (isErrorAll) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error loading teams</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-6 w-full">
            {viewType === 'teams' && (
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sortByConference}
                            onChange={(e) => setSortByConference(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">Sort by Conference (AFC first, then NFC)</span>
                    </label>
                </div>
            )}

            <div className="flex items-center gap-4 flex-wrap">
                {filters.map(filter => (
                    <Dropdown
                        key={filter.key}
                        options={dropdownOptions[filter.key]}
                        value={getSelectedOption(filter.key)}
                        onChange={(opt) => handleFilterChange(filter.key, String(opt.value))} 
                        placeholder={filter.placeholder}
                        className="w-54"
                    />
                ))}
            </div>

            {enableSorting && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <Dropdown
                        options={SORT_OPTIONS}
                        value={selectedSortOption}
                        onChange={handleSortChange}  
                        placeholder="Sort order..."
                        className="w-64"
                    />
                </div>
            )}

            {(Object.keys(activeFilters).length > 0 || sortBy || sortByConference) && (
                <Button primaryTwo rounded onClick={handleClearFilters}>
                    Clear All Filters
                </Button>
            )}

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
                <p className="text-lg font-semibold">{totalUniqueCapacity}</p>
            </div>

            <div className="w-full max-w-4xl mx-auto">
                {sortedAndFilteredTeams.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                            {displayedTeams.map(team => (
                                <TeamCard key={team._id} team={team} />
                            ))}
                        </div>
                        
                        {hasMoreTeams && !showAllTeams && (
                            <div className="flex justify-center mt-6">
                                <Button primary rounded onClick={() => setShowAllTeams(true)}>
                                    See All Results ({sortedAndFilteredTeams.length} teams)
                                </Button>
                            </div>
                        )}
                        
                        {hasMoreTeams && showAllTeams && (
                            <div className="flex justify-center mt-6">
                                <Button primaryTwo rounded onClick={() => setShowAllTeams(false)}>
                                    Show Less
                                </Button>
                            </div>
                        )}
                    </>
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