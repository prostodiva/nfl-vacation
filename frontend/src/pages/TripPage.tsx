import { useState } from "react";
import Button from "../components/Button";
import Trip from "../components/Trip";

type Trip = {
  type: 'CUSTOM' | 'OPTIMAL' | 'Efficient';
  team: string;
} | null;

function TripPage() {
const [selectedTrip, setSelectedTrip] = useState<Trip>(null);

  const handleEfficientCustomClick = () => {
     setSelectedTrip({ type: 'Efficient', team: ''})
  }

  const handleCustomTripClick = () => {
    setSelectedTrip({ type: 'CUSTOM', team: ''})
  }

  const handleOptimalTripClick = () => {
    setSelectedTrip({ type: 'OPTIMAL', team: ''})
  }

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-2 w-full">
            <h1 className="text-[35px] leading-tight text-black mt-6 text-center" style={{ fontFamily: 'SCHABO, sans-serif'}}>
                        CHOOSE THE TYPE OF THE TRIP
            </h1>

            <div className="flex flex-row items-center space-x-10 mt-10">
            <Button 
                  secondary 
                  rounded 
                  active={selectedTrip?.type === 'CUSTOM'}
                  onClick={handleCustomTripClick}
                >
                  CUSTOM TRIP<br></br>CREATE YOUR OWN NFL DREAM TRIP
                </Button>
                
                <Button 
                  secondary 
                  rounded 
                  active={selectedTrip?.type === 'Efficient'}
                  onClick={handleEfficientCustomClick}
                >
                  EFFICIENT CUSTOM TRIP<br></br>Minimize travel time and distance
                </Button>
                
                <Button 
                  secondary 
                  rounded 
                  active={selectedTrip?.type === 'OPTIMAL'}
                  onClick={handleOptimalTripClick}
                >
                  OPTIMAL TRIP<br></br>Starting from New England Patriots
                </Button>
            </div>
          </div>

          <div>
            <Trip trip={selectedTrip}/>
          </div>
          </div>
      </div>
    </div>
  );
}

export default TripPage;
