import { useState } from 'react';
import { useCalculateRecursiveRouteMutation } from "../store/apis/algorithmApi";
import { useAddToCartMutation } from '../store/apis/purchaseApi';
import { useGetAllTeamsQuery } from '../store/apis/teamsApi';
import type { Team } from "../store/types/teamTypes";
import Button from "./Button";
import SummaryCard from "./SummaryCard";
import TeamList from "./TeamList";

function OptimalTrip() {
    const [routeError, setRouteError] = useState<string | null>(null);
    const { data: teamsData } = useGetAllTeamsQuery();
    const [calculateRoute, { data: routeData, isLoading: isCalculating }] =
        useCalculateRecursiveRouteMutation();

    const [addToCart] = useAddToCartMutation();
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [notificationPosition, setNotificationPosition] = useState<{ top: number; left: number } | null>(null);

    const handleAddToCart = async (souvenirId: string, event?: React.MouseEvent<HTMLButtonElement>) => {
        try {
            await addToCart({ souvenirId, quantity: 1 }).unwrap();
            
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


    const handleCalculateRoute = async () => {
        setRouteError(null);
        try {
            await calculateRoute().unwrap();
        } catch (error: any) {
            setRouteError(error?.data?.error || 'Failed to calculate route');
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-row gap-6 items-center">
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
                                showSouvenirs={true} 
                                showAddToCart={true} 
                                onAddToCart={handleAddToCart}  
                        />
                    <SummaryCard 
                        algorithm="Recursive Nearest Neighbor"
                        startTeam={routeData.data.startTeam}
                        totalDistance={routeData.data.totalDistance}
                        teamCount={routeData.data.teamCount}
                    />
                </div>
            )}

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
        </div>
    );
}

export default OptimalTrip;