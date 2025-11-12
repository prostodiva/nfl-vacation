import { useState } from 'react';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';
import { useGetAllTeamsQuery } from '../store/apis/teamsApi';
import Skeleton from './Skeleton';
import Button from './Button';
import TeamCard from './TeamCard';

function CustomTrip() {
    const [selectedTeam, setSelectedTeam] = useState<DropdownOption | null>(null);
    const [addedTeams, setAddedTeams] = useState<Team[]>([]);
    const { data: teamsData, isLoading, isError } = useGetAllTeamsQuery();

    const teamOptions: DropdownOption[] = teamsData?.data.map(team => ({
        value: team._id,
        label: team.teamName
    })) || [];

    const handleAddClick = () => {
        if (!selectedTeam || !teamsData) return;
        
        const teamToAdd = teamsData.data.find(team => team._id === selectedTeam.value);
        
        if (teamToAdd && !addedTeams.find(t => t._id === teamToAdd._id)) {
            setAddedTeams([...addedTeams, teamToAdd]);
            setSelectedTeam(null);
        }
    }

    const handleRemoveTeam = (teamId: string) => {
        setAddedTeams(addedTeams.filter(team => team._id !== teamId));
    }

    const handleSubmit = () => {

    }

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
        <div className="flex flex-col items-center w-full">
            <p className="text-gray-700 mb-2">
                TEAM:
            </p>
            <div className="flex flex-row gap-6">
                    <Dropdown
                        options={teamOptions}
                        value={selectedTeam}
                        onChange={setSelectedTeam}
                        placeholder="Choose a team..."
                    />
                <Button
                    ternary
                    rounded 
                    onClick={handleAddClick}
                >
                    ADD
                </Button>
            </div>

             {addedTeams.length > 0 && (
                <div className="mt-6 space-y-4 w-full max-w-4xl">
                    <h3 className="text-lg font-semibold">Selected Teams:</h3>
                    {addedTeams.map((team) => (
                          <div key={team._id} className="relative">
                          <TeamCard team={team} />
                          <button
                              onClick={() => handleRemoveTeam(team._id)}
                              className="absolute top-14 right-4 bg-gray-500 hover:bg-black text-white w-8 h-8 flex items-center justify-center "
                              aria-label="Remove team"
                          >
                              ✕
                          </button>
                      </div>
                    ))}
                </div>
            )}
            <div className='mt-4'>
                <Button
                    submit
                    rounded 
                    onClick={handleSubmit}
                >
                    SUBMIT
                </Button>
            </div>
            
        </div>
    );
}

export default CustomTrip;