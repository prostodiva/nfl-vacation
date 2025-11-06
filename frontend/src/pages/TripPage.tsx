import Map from "../components/Map";

function TripPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-start space-y-2 w-full">
            <h1 className="text-[35px] leading-tight text-black mt-6" style={{ fontFamily: 'SCHABO, sans-serif'}}>
                        CHOOSE THE TYPE OF THE TRIP
            </h1>
          </div>

          <div>
            <Map />
          </div>
          </div>
      </div>
    </div>
  );
}

export default TripPage;
