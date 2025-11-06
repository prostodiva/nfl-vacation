import { useState } from "react";
import Map from "../components/Map";
import Button from "../components/Button";

type Trip = {
  type: 'CUSTOM' | 'OPTMAL' | 'AI';
  team: string;
} | null;

function TripPage() {
const [selectedTrip, setSelectedTrip] = useState<Trip>(null);

  const handleAITripClick = () => {
     setSelectedTrip({ type: 'CUSTOM', team: ''})
  }

  const handleCustomTripClick = () => {
    setSelectedTrip({ type: 'OPTIMAL', team: ''})
  }

  const handleOptimalRouteClick = () => {
    setSelectedTrip({ type: 'AI', team: ''})
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-start space-y-2 w-full">
            <h1 className="text-[35px] leading-tight text-black mt-6" style={{ fontFamily: 'SCHABO, sans-serif'}}>
                        CHOOSE THE TYPE OF THE TRIP
            </h1>

            <div className="flex flex-row items-center space-x-10 mt-10">
                <Button secondary rounded onClick={handleCustomTripClick}>CUSTOM TRIP<br></br>CREATE YOUR OWN NFL ROAD TRIP</Button>
                <Button secondary rounded onClick={handleOptimalRouteClick}>OPTIMAL ROUTE<br></br>VISIT ALL 32 TEAMS EFFICIETLY</Button>
                <Button secondary rounded onClick={handleAITripClick}>OPTIMIZE TRIP<br></br>LET AI OPTIMIZE YOUR TRIP</Button>
            </div>
          </div>

          <div>
            <Map trip={selectedTrip}/>
          </div>
          </div>
      </div>
    </div>
  );
}

export default TripPage;
