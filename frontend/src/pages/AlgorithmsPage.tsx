import Button from "../components/Button";
import Map from "../components/Map"
import { useState } from "react";

// Define the type
type Algorithm = {
  type: 'DFS' | 'BFS' | 'DIJKSTRA' | 'A*' | 'kruskal';
  team?: string;
  endTeam?: string;
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
        setSelectedAlgorithm({ type: 'DIJKSTRA', team: 'Green Bay Packers'});
    }

    const handleAStarClick = () => {
        setSelectedAlgorithm({ type: 'A*', team: 'Green Bay Packers' });
    }

    const handleKruskalClick = () => {
      setSelectedAlgorithm({ type: 'kruskal' });
    }

    const handleEndTeamSelect = (endTeam: 'Denver Broncos' | 'New England Patriots') => {
        if (selectedAlgorithm) {
            setSelectedAlgorithm({
                ...selectedAlgorithm,
                endTeam: endTeam
            });
        }
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
                <Button secondary rounded onClick={handleAStarClick}>A*<br></br>GREEN BAY PACKERS</Button>
                <Button secondary rounded onClick={handleKruskalClick}>KRUSKAL'S ALGORITHM<br></br>MST</Button>
            </div>
              {/* Show endTeam selection when DIJKSTRA or A* is selected */}
              {(selectedAlgorithm?.type === 'DIJKSTRA' || selectedAlgorithm?.type === 'A*') && (
                  <div className="flex flex-row items-center space-x-4 mt-4">
                      <p className="text-sm text-gray-600">Select destination:</p>
                      <Button
                          secondary
                          rounded
                          active={selectedAlgorithm.endTeam === 'Denver Broncos'}
                          onClick={() => handleEndTeamSelect('Denver Broncos')}
                      >
                          DENVER BRONCOS
                      </Button>
                      <Button
                          secondary
                          rounded
                          active={selectedAlgorithm.endTeam === 'New England Patriots'}
                          onClick={() => handleEndTeamSelect('New England Patriots')}
                      >
                          NEW ENGLAND PATRIOTS
                      </Button>
                  </div>
              )}
              {/* Show description when Kruskal's is selected */}
              {selectedAlgorithm?.type === 'kruskal' && (
                  <div className="mt-4 text-center">
                      <p className="text-sm text-gray-700">
                          Shows the minimum total distance to connect all NFL stadiums<br></br>
                          An MST for a connected graph with N nodes has N-1 edges.
                      </p>
                  </div>
              )}
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
