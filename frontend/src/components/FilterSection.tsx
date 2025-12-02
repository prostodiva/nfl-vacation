/**
 * @fileoverview FilterSection component - Advanced filtering and sorting for teams/stadiums
 * @module FilterSection
 */

import { useMemo, useState } from 'react';
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

/**
 * Props for FilterSection component
 */
interface FilterSectionProps {
    /** Array of filter configurations */
    filters: FilterConfig[];
    /** Optional title for the filter section */
    title?: string;
    /** Whether to enable sorting functionality */
    enableSorting?: boolean;
    /** Type of view: 'teams' or 'stadiums' */
    viewType?: 'teams' | 'stadiums';
}

/**
 * FilterSection component
 * Provides advanced filtering, sorting, and display of teams or stadiums
 * Supports multiple filter types, sorting options, and roof type filtering
 * 
 * @param {FilterSectionProps} props - Component props
 * @returns {JSX.Element} Filter section with teams/stadiums display
 * 
 * @example
 * ```tsx
 * <FilterSection
 *   filters={teamFilters}
 *   enableSorting={true}
 *   viewType="teams"
 * />
 * ```
 */
function FilterSection({ filters, enableSorting = false, viewType = 'teams' }: FilterSectionProps) {
    const {
        data: allTeamsData,
        isLoading: isLoadingAll,
        isError: isErrorAll
    } = useGetAllTeamsQuery();

    const {
        data: stadiumsData,
        isLoading: isLoadingStadiums
    } = useGetTeamsByStadiumsQuery(undefined, {
        skip: viewType !== 'stadiums'  // Only fetch when on stadiums tab
    });

    const {
        data: conferenceData,
        isLoading: isLoadingConference
    } = useGetAllTeamsByConferenceQuery(undefined, {
        skip: viewType !== 'teams'  // Only fetch when on teams tab
    });

    // Get the selected roof type from filters
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const roofTypeFilter = activeFilters['roofType'];
    // Map 'Dome' to 'Fixed' for API compatibility, or use as-is if it's already a valid type
    const selectedRoofType = roofTypeFilter === 'Dome' 
        ? 'Fixed' as const
        : (roofTypeFilter as 'Open' | 'Fixed' | 'Retractable' | undefined);

    // Fetch stadiums by roof type when a roof type is selected
    const {
        data: roofTypeData,
        isLoading: isLoadingRoofType
    } = useGetStadiumsByRoofTypeQuery(selectedRoofType as 'Open' | 'Fixed' | 'Retractable', {
        skip: !selectedRoofType || viewType !== 'stadiums'  // Only fetch when roof type is selected and on stadiums tab
    });
    const [sortByConference, setSortByConference] = useState<boolean>(false);

    // Add state to track if showing all teams
    const [showAllTeams, setShowAllTeams] = useState(false);

    // Compute combined loading state based on viewType
    const isLoading = useMemo(() => {
        if (viewType === 'stadiums') {
            return isLoadingStadiums || (selectedRoofType ? isLoadingRoofType : false);
        }
        if (viewType === 'teams') {
            return isLoadingConference || isLoadingAll;
        }
        return isLoadingAll;
    }, [viewType, isLoadingStadiums, isLoadingConference, isLoadingAll, isLoadingRoofType, selectedRoofType]);

    // Add a helper function at the top
    const filterTeamsWithStadiums = (teams: Team[] | undefined): Team[] => {
        if (!teams) return [];
        return teams.filter(team => team.stadium != null);
    };

    // Then use it when getting data
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

    // Get teams or stadium items based on data type
    const isRoofTypeData = selectedRoofType && viewType === 'stadiums' && roofTypeData;

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

    // Transform roof type data to Team format for unified display
    const displayData = useMemo(() => {
        if (isRoofTypeData && roofTypeData) {
            // Transform StadiumItem[] to Team[] format
            return roofTypeData.data.map((stadium, index) => ({
                _id: `stadium-${index}`,
                teamName: stadium.teamName,
                conference: '' as any, // Not available in stadium data
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
        return teams; // Fallback to allTeams if not roof type data
    }, [isRoofTypeData, roofTypeData, teams]);

    // Apply client-side filtering to displayData (works for both roof type and regular data)
    const {
        filters: clientFilters,
        filteredData: finalFilteredData,
        setFilter: setClientFilter,
        clearAllFilters: clearClientFilters,
        hasActiveFilters: _hasClientFilters
    } = useFilter(displayData, filterConfig);

    // Now all the sorting/filtering code can safely access team.stadium without optional chaining
    const sortedAndFilteredTeams = useMemo(() => {
        // If no explicit sorting is selected
        if (!sortBy || !sortOrder) {
            // If conference sorting is enabled, preserve backend's conference order
            if (sortByConference) {
                // Don't re-sort - backend already sorted by conference, then teamName
                return finalFilteredData;
            }
            // When viewing stadiums, sort by stadium name; otherwise sort by teamName
            if (viewType === 'stadiums') {
                return [...finalFilteredData].sort((a, b) =>
                    a.stadium.name.localeCompare(b.stadium.name)
                );
            }
            // Otherwise, sort alphabetically by teamName (matches getAllTeams)
            return [...finalFilteredData].sort((a, b) =>
                a.teamName.localeCompare(b.teamName)
            );
        }

        // Apply explicit sorting (yearOpened or capacity)
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
                // Default to teamName sorting if sortBy doesn't match
                return a.teamName.localeCompare(b.teamName);
            }

            return sortOrder === 'asc'
                ? valueA - valueB
                : valueB - valueA;
        });
    }, [finalFilteredData, sortBy, sortOrder, sortByConference, viewType]);  // Add viewType to dependencies

    const uniqueStadiumCount = useMemo(() => {
        if (isRoofTypeData && roofTypeData) {
            // Count unique stadiums from filtered data
            const stadiumNames = new Set(finalFilteredData.map(team => team.stadium.name));
            return stadiumNames.size;
        }
        const stadiumNames = new Set(finalFilteredData.map(team => team.stadium.name));
        return stadiumNames.size;
    }, [isRoofTypeData, roofTypeData, finalFilteredData]);

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
        // Get value from activeFilters for roofType, otherwise from clientFilters
        const value = filterKey === 'roofType' 
            ? activeFilters[filterKey]
            : clientFilters[filterKey];
        return options?.find(opt => opt.value === value) || null;
    };

    // Add handler for filter changes
    const handleFilterChange = (filterKey: string, value: string) => {
        if (filterKey === 'roofType') {
            // Update activeFilters for roof type to trigger API call
            setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
        } else {
            // Use client-side filtering for other filters
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

    if (isErrorAll) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error loading teams</p>
            </div>
        );
    }

    // Determine which teams to display
    const displayedTeams = useMemo(() => {
        if (showAllTeams) {
            return sortedAndFilteredTeams;
        }
        return sortedAndFilteredTeams.slice(0, 3);
    }, [sortedAndFilteredTeams, showAllTeams]);
    
    // Check if there are more than 3 teams
    const hasMoreTeams = sortedAndFilteredTeams.length > 3;

    return (
        <div className="flex flex-col items-center space-y-6 w-full">
            {/* Toggle for conference sorting (only show on teams tab) */}
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


            {/* Dynamic Dropdowns */}
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
                        options={sortOptions}
                        value={selectedSortOption}
                        onChange={handleSortChange}  
                        placeholder="Sort order..."
                        className="w-64"
                    />
                </div>
            )}

            {/* Clear Filters Button */}
            {(activeFilters || sortBy || sortByConference) && (
                    <Button
                        primaryTwo
                        rounded
                        onClick={() => {
                            setActiveFilters({});
                            clearClientFilters();
                            setSortBy(null);
                            setSortOrder(null);
                            setSortByConference(false);
                        }}
                    >
                        Clear All Filters
                    </Button>
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
                                <Button
                                    primary
                                    rounded
                                    onClick={() => setShowAllTeams(true)}
                                >
                                    See All Results ({sortedAndFilteredTeams.length} teams)
                                </Button>
                            </div>
                        )}
                        
                        {hasMoreTeams && showAllTeams && (
                            <div className="flex justify-center mt-6">
                                <Button
                                    primaryTwo
                                    rounded
                                    onClick={() => setShowAllTeams(false)}
                                >
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