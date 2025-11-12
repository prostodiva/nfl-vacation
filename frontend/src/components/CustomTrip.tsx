import { useState } from 'react';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';
import { useGetAllTeamsQuery } from '../store/apis/teamsApi';
import Skeleton from './Skeleton';
import Button from './Button';
import type { Team } from '../store/types/teamTypes';
import TeamList from './TeamList';
import { useCalculateCustomRouteMutation } from "../store/apis/algorithmApi.ts";


function CustomTrip() {
    const [selectedTeam, setSelectedTeam] = useState<DropdownOption | null>(null);
    const [addedTeams, setAddedTeams] = useState<Team[]>([]);
    const { data: teamsData, isLoading, isError } = useGetAllTeamsQuery();
    const [routeError, setRouteError] = useState<string | null>(null);
    const [calculateRoute, { data: routeData, isLoading: isCalculating, isError: hasError }] = 
    useCalculateCustomRouteMutation();

    const teamOptions: DropdownOption[] = teamsData?.data.map(team => ({
        value: team._id,
        label: team.teamName
    })) || [];

    const handleReorder = (reorderedTeams: Team[]) => {
        setAddedTeams(reorderedTeams);
    };

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

    const handleSubmit = async () => {
        if (addedTeams.length < 2) {
            alert('Please add at least 2 teams to calculate the route');
            return;
        }

        setRouteError(null);

        try {
            const teamIds = addedTeams.map(team => team._id);
            const result = await calculateRoute({ teamIds }).unwrap();
            console.log('Route calculated:', result.data);
        } catch (error: any) {
            const errorMessage = error.data?.error || 'Failed to calculate route. Please try again.';
            setRouteError(errorMessage);
        }
    };

    const handleClear = () => {
        setAddedTeams([]);
        setRouteError(null);
    };

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
            <div className="flex flex-row gap-6 items-center">
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

                {addedTeams.length > 0 && (
                    <Button
                        ternary
                        rounded
                        onClick={handleClear}
                    >
                        CLEAR ALL
                    </Button>
                )}
            </div>

            <div className="flex flex-col items-center w-full mt-4">
                {/* Info message */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl">
                    <p className="text-blue-800 text-sm">
                        ℹ️ <strong>Note:</strong> Only certain team connections are available.
                        If you receive an error, try reordering your teams or choosing teams
                        that are geographically closer together.
                    </p>
                </div>
            </div>

            <TeamList
                teams={addedTeams}
                onReorder={handleReorder}
                onRemoveTeam={handleRemoveTeam}
            />

            {routeError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-4xl">
                    <div className="flex items-start gap-3">
                        <span className="text-red-500 text-xl">⚠️</span>
                        <div>
                            <p className="text-red-800 font-semibold mb-1">Cannot Calculate Route</p>
                            <p className="text-red-700 text-sm">{routeError}</p>
                        </div>
                    </div>
                </div>
            )}

            {addedTeams.length > 0 && (
                <div className='mt-4'>
                    <Button
                        submit
                        rounded 
                        onClick={handleSubmit}
                        disabled={isCalculating}

                    >
                        {isCalculating ? 'CALCULATING...' : 'CALCULATE ROUTE'}
                    </Button>
                </div>
            )}
            
            {routeData?.data && (
                <div className="flex flex-row items-center space-x-6 mt-6">
                    <p className="text-sm text-gray-600">Total Distance: </p>
                    <p>{routeData.data.totalDistance.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">miles</p>
                </div> 
            )}  
        </div>
    );
}

export default CustomTrip;