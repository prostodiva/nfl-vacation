import { useState } from 'react';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';
import { useGetAllTeamsQuery } from '../store/apis/teamsApi';
import Skeleton from './Skeleton';
import Button from './Button';

function CustomTrip() {
    const [selectedTeam, setSelectedTeam] = useState<DropdownOption | null>(null);

    const { data: teamsData, isLoading, isError } = useGetAllTeamsQuery();

    const teamOptions: DropdownOption[] = teamsData?.data.map(team => ({
        value: team._id,
        label: team.teamName
    })) || [];

   if (isLoading) {
        return (
            <div className="flex flex-col items-center space-y-6 w-full">
                {<Skeleton times={1} className="h-8 w-48" />}

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
        <div>
            <p className="text-gray-700 mb-2">
                TEAM:
            </p>
            <div className="flex flex-row gap-6">
                <div>
                    <Dropdown
                        options={teamOptions}
                        value={selectedTeam}
                        onChange={setSelectedTeam}
                        placeholder="Choose a team..."
                    />
                </div>
                <Button ternary rounded>ADD</Button>
            </div>
        </div>
    );
}

export default CustomTrip;