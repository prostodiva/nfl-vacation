import { useCalculateRecursiveRouteMutation } from "../store/apis/algorithmApi";
import { useState } from 'react';
import { useGetAllTeamsQuery } from '../store/apis/teamsApi';
import Button from "./Button";
import TeamList from "./TeamList";
import type { Team } from "../store/types/teamTypes";
import SummaryCard from "./SummaryCard";

function OptimalTrip() {
    const [routeError, setRouteError] = useState<string | null>(null);
    const { data: teamsData } = useGetAllTeamsQuery();
    const [calculateRoute, { data: routeData, isLoading: isCalculating }] =
        useCalculateRecursiveRouteMutation();

    const handleCalculateRoute = async () => {
        setRouteError(null);
        try {
            await calculateRoute().unwrap();
        } catch (error: any) {
            setRouteError(error?.data?.error || 'Failed to calculate route');
        }
    };

    return (
        <div className="flex flex-col items-center w-full gap-6">
            <div className="flex flex-col gap-4 items-center">
                <p className="text-sm text-gray-600">
                    Starting from New England Patriots
                </p>
                
                <Button
                    primary
                    onClick={handleCalculateRoute}
                    disabled={isCalculating}
                >
                    {isCalculating ? 'Calculating...' : 'Calculate Efficient Route'}
                </Button>

                {routeError && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                        {routeError}
                    </div>
                )}
            </div>

            {routeData?.success && (
                <div className="flex flex-col items-center w-full">
                       <TeamList 
                            teams={routeData.data.route
                                .map(teamName => teamsData?.data?.find((t: Team) => t.teamName === teamName))
                                .filter((team): team is Team => team !== undefined)
                            }
                        />
                    <SummaryCard 
                        algorithm="Recursive Nearest Neighbor"
                        startTeam={routeData.data.startTeam}
                        totalDistance={routeData.data.totalDistance}
                        teamCount={routeData.data.teamCount}
                    />
                </div>
            )}
        </div>
    );
}

export default OptimalTrip;