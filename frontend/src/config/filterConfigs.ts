import type { DropdownOption } from '../components/Dropdown';
import type { Team } from '../store/types/teamTypes';

import {
    transformConferenceOptions,
    transformDivisionOptions,
    transformRoofTypeOptions,
    transformStadiumLocationOptions,
    transformStadiumNameOptions,
    transformSurfaceTypeOptions,
    transformTeamsToOptions,
    transformYearOpenedOptions
} from '../utils/dropdownTransformers';

export interface FilterConfig {
    key: string;
    getValue: (team: Team) => string | number;
    getOptions: (teams: Team[]) => DropdownOption[];
    placeholder: string;
}

export const teamFilters = [
    {
        key: 'team',
        getValue: (team: Team) => team._id,
        getOptions: transformTeamsToOptions,
        placeholder: 'Select team...'
    },
    {
        key: 'conference',
        getValue: (team: Team) => team.conference,
        getOptions: transformConferenceOptions,
        placeholder: 'Select conference...'
    },
    {
        key: 'division',
        getValue: (team: Team) => team.division,
        getOptions: transformDivisionOptions,
        placeholder: 'Select division...'
    }
];

export const stadiumFilters = [
    {
        key: 'stadiumName',
        getValue: (team: Team) => team.stadium.name,
        getOptions: transformStadiumNameOptions,
        placeholder: 'Select stadium...'
    },
    {
        key: 'location',
        getValue: (team: Team) => team.stadium.location,
        getOptions: transformStadiumLocationOptions,
        placeholder: 'Select location...'
    },
    {
        key: 'surfaceType',
        getValue: (team: Team) => team.stadium.surfaceType,
        getOptions: transformSurfaceTypeOptions,
        placeholder: 'Select surface...'
    },
    {
        key: 'roofType',
        getValue: (team: Team) => team.stadium.roofType,
        getOptions: transformRoofTypeOptions,
        placeholder: 'Select roof type...'
    },
    {
        key: 'yearOpened',
        getValue: (team: Team) => team.stadium.yearOpened,
        getOptions: transformYearOpenedOptions,
        placeholder: 'Select year opened...'
    }
];

export const SORT_OPTIONS: DropdownOption[] = [
    { value: 'none', label: 'No sorting' },
    { value: 'yearOpened-asc', label: 'Oldest first (1924→2023)' },
    { value: 'yearOpened-desc', label: 'Newest first (2023→1924)' },
    { value: 'capacity-asc', label: 'Capacity: Smallest first' },
    { value: 'capacity-desc', label: 'Capacity: Largest first' }
];