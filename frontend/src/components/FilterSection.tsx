import Dropdown, { type DropdownOption } from './Dropdown';
import TeamCard from "./TeamCard";
import { useMemo } from "react";
import { useGetAllTeamsQuery } from "../store/apis/teamsApi";
import { useFilter } from "../hooks/useFilter";
import type { FilterConfig } from "../config/filterConfigs.ts";

interface FilterSectionProps {
    filters: FilterConfig[];
    title?: string;
}

function FilterSection({ filters  }: FilterSectionProps) {
    const { data, isLoading, isError } = useGetAllTeamsQuery();
    const teams = data?.data || [];

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

    const dropdownOptions = useMemo(() => {
        return filters.reduce((acc, filter) => {
            acc[filter.key] = filter.getOptions(teams);
            return acc;
        }, {} as Record<string, DropdownOption[]>);
    }, [teams, filters]);

    const getSelectedOption = (filterKey: string) => {
        const options = dropdownOptions[filterKey];
        return options?.find(opt => opt.value === activeFilters[filterKey]) || null;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
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

            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                >
                    Clear All Filters
                </button>
            )}

            {/* Results Count */}
            <div className="text-gray-600">
                Showing {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}
            </div>

            {/* Display Filtered Teams */}
            <div className="w-full max-w-6xl">
                {filteredTeams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                        {filteredTeams.map(team => (
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