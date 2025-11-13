import Button from "../components/Button";
import Map from "../components/Map"
import { useState } from "react";

// Define the type
type Algorithm = {
  type: 'DFS' | 'BFS' | 'DIJKSTRA';
  team: string;
} | null;

function AlgorithmsPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(null);

  const handleDFSClick = () => {
    setSelectedAlgorithm({ type: 'DFS', team: 'Minnesota Vikings'})
  }

  const handleBFSClick = () => {
    setSelectedAlgorithm({ type: 'BFS', team: 'Los Angeles Rams' });
  }

  const handleDijkstraClick = () => {
    setSelectedAlgorithm({ type: 'DIJKSTRA', team: 'Green Bay Packers' });
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-2 w-full">
            <h1 className="text-[35px] leading-tight text-black mt-6" style={{ fontFamily: 'SCHABO, sans-serif'}}>
                        INTERACTIVE PATH SIMULATION
            </h1>
            <p className="text-l leading-relaxed ml-16">
                Choose an algorithm and watch the route evolve <br></br> across the NFL map
            </p>
            <div className="flex flex-row items-center space-x-10 mt-10">
                <Button secondary rounded onClick={handleDFSClick}>DFS<br></br>MINNESOTA VIKINGS</Button>
                <Button secondary rounded onClick={handleBFSClick}>BFS<br></br>LOS ANGLELES RAMS</Button>
                <Button secondary rounded onClick={handleDijkstraClick}>DIJKSTRA'S<br></br>GREEN BAY PACKERS</Button>
            </div>
          </div>

          <div>
            <Map algorithm={selectedAlgorithm} />
          </div>
          </div>
      </div>
    </div>
  );
}

export default AlgorithmsPage;
