import { useState } from 'react';
import { useCalculateCustomRouteMutation } from "../store/apis/algorithmApi.ts";
import { useAddToCartMutation } from '../store/apis/purchaseApi';
import { useGetAllTeamsQuery } from '../store/apis/teamsApi';
import type { Team } from '../store/types/teamTypes';
import Button from './Button';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';
import Skeleton from './Skeleton';
import TeamList from './TeamList';


function CustomTrip() {
    const [selectedTeam, setSelectedTeam] = useState<DropdownOption | null>(null);
    const [addedTeams, setAddedTeams] = useState<Team[]>([]);
    const { data: teamsData, isLoading, isError } = useGetAllTeamsQuery();
    const [routeError, setRouteError] = useState<string | null>(null);
    const [calculateRoute, { data: routeData, isLoading: isCalculating, isError: hasError, reset }] =
    useCalculateCustomRouteMutation();

    const [addToCart] = useAddToCartMutation();
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [notificationPosition, setNotificationPosition] = useState<{ top: number; left: number } | null>(null);

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

    const handleAddToCart = async (souvenirId: string, quantity: number, event?: React.MouseEvent<HTMLButtonElement>) => {
        try {
            await addToCart({ souvenirId, quantity }).unwrap();
            
            // Get button position if event is provided
            let position = { top: 80, left: window.innerWidth - 100 };
            
            if (event && event.currentTarget) {
                try {
                    const button = event.currentTarget;
                    const rect = button.getBoundingClientRect();
                    position = {
                        top: rect.top + window.scrollY - 40,
                        left: rect.left + window.scrollX + rect.width / 2
                    };
                } catch (err) {
                    console.warn('Could not calculate button position, using fallback');
                }
            }
            
            setNotificationPosition(position);
            setShowCartNotification(true);
            
            setTimeout(() => {
                setShowCartNotification(false);
                setNotificationPosition(null);
            }, 3000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    const handleClear = () => {
        setAddedTeams([]);
        setRouteError(null);
        reset?.();
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

           <TeamList
                teams={addedTeams}
                onReorder={handleReorder}
                onRemoveTeam={handleRemoveTeam}
                showSouvenirs={true}
                showAddToCart={true}
                onAddToCart={handleAddToCart}
            />

             {/* Add notification */}
            {showCartNotification && notificationPosition && (
                <div 
                    className="fixed text-black px-4 py-2 z-[9999] pointer-events-none whitespace-nowrap"
                    style={{
                        top: `${notificationPosition.top}px`,
                        left: `${notificationPosition.left}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    Item added to cart 🛒
                </div>
            )}

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