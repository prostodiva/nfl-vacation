import type { Team } from '../store/types/teamTypes';
import { type DropdownOption } from '../components/Dropdown';

export const transformTeamsToOptions = (teams: Team[]): DropdownOption[] => {
    return teams.map(team => ({
        value: team._id,
        label: team.teamName
    }));
};

export const transformConferenceOptions = (teams: Team[]): DropdownOption[] => {
    const conferences = [...new Set(teams.map(team => team.conference))];
    return conferences.map(conf => ({
        value: conf,
        label: conf
    }));
};

export const transformDivisionOptions = (teams: Team[]): DropdownOption[] => {
    const divisions = [...new Set(teams.map(team => team.division))];
    return divisions.map(div => ({
        value: div,
        label: div
    }));
};


// Stadium transformers (from teams data)
export const transformStadiumNameOptions = (teams: Team[]): DropdownOption[] => {
    const stadiumNames = [...new Set(teams.map(team => team.stadium.name))];
    return stadiumNames.map(name => ({
        value: name,
        label: name
    }));
};

export const transformStadiumLocationOptions = (teams: Team[]): DropdownOption[] => {
    const locations = [...new Set(teams.map(team => team.stadium.location))];
    return locations.map(location => ({
        value: location,
        label: location
    }));
};

export const transformSurfaceTypeOptions = (teams: Team[]): DropdownOption[] => {
    const surfaceTypes = [...new Set(teams.map(team => team.stadium.surfaceType))];
    return surfaceTypes.map(surface => ({
        value: surface,
        label: surface
    }));
};

export const transformRoofTypeOptions = (teams: Team[]): DropdownOption[] => {
    const roofTypes = [...new Set(teams.map(team => team.stadium.roofType))];
    return roofTypes.map(roof => ({
        value: roof,
        label: roof
    }));
};

export const transformYearOpenedOptions = (teams: Team[]): DropdownOption[] => {
    const years = [...new Set(teams.map(team => team.stadium.yearOpened))];
    return years
        .sort((a, b) => b - a)  // Sort newest to oldest
        .map(year => ({
            value: year,
            label: String(year)
        }));
};