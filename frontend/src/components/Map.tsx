import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapImage from '../assets/map.svg'

interface MapProps {
    algorithm: {
        type: 'DFS' | 'BFS' | 'DIJKSTRA';
        team: string;
    } | null;
}

interface AlgorithmData {
    algorithm: string;
    startCity: string;
    visitOrder?: string[];  // For DFS/Dijkstra
    levels?: string[][];    // For BFS
    discoveryEdges: Array<{
        from: string;
        to: string;
        distance: number;
    }>;
    backEdges?: Array<{    // Ignored in animation
        from: string;
        to: string;
        distance: number;
    }>;
    crossEdges?: Array<{   // Ignored in animation
        from: string;
        to: string;
        distance: number;
    }>;
    totalDistance: number;
}

// Stadium coordinates on the map
const stadiumCoordinates: { [key: string]: { x: number; y: number } } = {
    "Minnesota Vikings":  { x: 718, y: 166 } ,
    "Green Bay Packers": { x: 803, y: 175 },
    "Chicago Bears": { x: 814, y: 247 },
    "Indianapolis Colts": { x: 852, y: 269 },
    "Detroit Lions": { x: 891, y: 203 },
    "Cleveland Browns": { x: 920, y: 238 },
    "Pittsburgh Steelers": { x: 965, y: 245 },
    "Buffalo Bills": { x: 977, y: 187 },
    "New England Patriots": { x: 1099, y: 172 },
    "New York Giants": { x: 1054, y: 219 },
    "Philadelphia Eagles": { x: 1036, y: 237 },
    "New York Jets": { x: 1054, y: 219 },
    "Baltimore Ravens": { x: 1014, y: 260 },
    "Washington Commanders": { x: 1004, y: 285 },
    "Carolina Panthers": { x: 967, y: 366 },
    "Atlanta Falcons": { x: 897, y: 414 },
    "Cincinnati Bengals": { x: 891, y: 285 },
    "Tennessee Titans": { x: 837, y: 370 },
    "Kansas City Chiefs": { x: 706, y: 299 },
    "Dallas Cowboys": { x: 648, y: 448 },
    "Houston Texans": { x: 680, y: 537 },
    "New Orleans Saints": { x: 784, y: 522 },
    "Tampa Bay Buccaneers": { x: 968, y: 548 },
    "Jacksonville Jaguars": { x: 966, y: 502 },
    "Miami Dolphins":  { x: 1004, y: 600 },
    "Arizona Cardinals": { x: 367, y: 406 },
    "Los Angeles Chargers": { x: 252, y: 373 },
    "San Francisco 49ers": { x: 199, y: 279 },
    "Las Vegas Raiders": { x: 313, y: 334 },
    "Los Angeles Rams": { x: 252, y: 373 },
    "Seattle Seahawks": { x: 262, y: 52 },
    "Denver Broncos": { x: 635, y: 455 },
};

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;

function Map({ algorithm }: MapProps) {
    const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
    const [currentNode, setCurrentNode] = useState<string | null>(null);
    const [animatedEdges, setAnimatedEdges] = useState<string[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [algorithmData, setAlgorithmData] = useState<AlgorithmData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch algorithm data from backend
// Fetch algorithm data from backend
useEffect(() => {
    if (!algorithm) return;

    const fetchAlgorithmData = async () => {
        try {
            setError(null);
            setIsAnimating(true);
            
            const algorithmEndpoint = algorithm.type.toLowerCase();
            const response = await fetch(`http://localhost:3001/api/graph/${algorithmEndpoint}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch algorithm data');
            }
            
            const result = await response.json();
            
            if (result.success) {
                setAlgorithmData(result.data);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setIsAnimating(false);
        }
    };

    fetchAlgorithmData();
}, [algorithm]);

// Animate the algorithm
useEffect(() => {
    if (!algorithmData) return;

    setVisitedNodes([]);
    setCurrentNode(null);
    setAnimatedEdges([]);

    // Handle both DFS (visitOrder) and BFS (levels) formats
    const visitOrder = algorithmData.visitOrder || 
                       (algorithmData.levels ? algorithmData.levels.flat() : []);
    
    const { discoveryEdges } = algorithmData;
    let nodeIndex = 0;
    let edgeIndex = 0;

    const interval = setInterval(() => {
        if (nodeIndex < visitOrder.length) {
            const currentNodeName = visitOrder[nodeIndex];
            setCurrentNode(currentNodeName);
            setVisitedNodes(prev => [...prev, currentNodeName]);

            if (edgeIndex < discoveryEdges.length) {
                const edge = discoveryEdges[edgeIndex];
                setAnimatedEdges(prev => [...prev, `${edge.from}-${edge.to}`]);
                edgeIndex++;
            }

            nodeIndex++;
        } else {
            clearInterval(interval);
            setIsAnimating(false);
            setCurrentNode(null);
        }
    }, 500);

    return () => clearInterval(interval);
}, [algorithmData]);

    if (!algorithm) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8"
            >
                <p className="text-gray-600">Please select an algorithm to begin</p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8"
            >
                <p className="text-red-600">Error: {error}</p>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </motion.button>
            </motion.div>
        );
    }

    if (!algorithmData) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8"
            >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block rounded-full h-8 w-8 border-b-2 border-gray-900"
                />
                <p className="text-gray-600 mt-2">Loading algorithm data...</p>
            </motion.div>
        );
    }

    return (
        <div className="bg-[#262422] min-h-screen w-screen">
            <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full flex flex-col items-center"
                    >
                    <div className="relative" style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
                        {/* Background map image */}
                        <motion.img 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            src={mapImage} 
                            alt="NFL Stadium Map" 
                            style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
                            className="object-contain"
                        />
                        
                        {/* SVG overlay for animation */}
                        <svg 
                            className="absolute top-0 left-0 pointer-events-none"
                            width={MAP_WIDTH}
                            height={MAP_HEIGHT}
                            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {/* Render discovery edges with animation */}
                            {algorithmData.discoveryEdges.map((edge, i) => {
                                const fromCoord = stadiumCoordinates[edge.from];
                                const toCoord = stadiumCoordinates[edge.to];
                                
                                if (!fromCoord || !toCoord) return null;
                                
                                const isAnimated = animatedEdges.includes(`${edge.from}-${edge.to}`);
                                
                                return (
                                    <motion.line
                                        key={`discovery-${i}`}
                                        x1={fromCoord.x}
                                        y1={fromCoord.y}
                                        x2={toCoord.x}
                                        y2={toCoord.y}
                                        initial={{ 
                                            pathLength: 0,
                                            stroke: 'transparent',
                                            strokeWidth: 1
                                        }}
                                        animate={{ 
                                            pathLength: isAnimated ? 1 : 0,
                                            stroke: isAnimated ? '#f76d1b' : 'transparent',
                                            strokeWidth: isAnimated ? 2 : 1
                                        }}
                                        transition={{ 
                                            duration: 0.5,
                                            ease: "easeOut"
                                        }}
                                    />
                                );
                            })}

                            {/* Render nodes with animation */}
                            <AnimatePresence>
                               {(algorithmData.visitOrder || algorithmData.levels?.flat() || []).map((city) => {
                                    const coord = stadiumCoordinates[city];
                                    if (!coord) return null;
                                    
                                    const isVisited = visitedNodes.includes(city);
                                    const isCurrent = currentNode === city;
                                    
                                    if (!isVisited) return null;
                                    
                                    return (
                                        <g key={city}>
                                            {/* Main circle */}
                                            <motion.circle
                                                cx={coord.x}
                                                cy={coord.y}
                                                r={isCurrent ? 14 : 10}
                                                fill={isCurrent ? '#f76d1b' : '#f76d1b'}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ 
                                                    scale: 1, 
                                                    opacity: 0.8,
                                                    r: isCurrent ? 14 : 10
                                                }}
                                                transition={{ 
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 20
                                                }}
                                            />
                                            
                                            {/* Pulse effect for current node */}
                                            {isCurrent && (
                                                <>
                                                    <motion.circle
                                                        cx={coord.x}
                                                        cy={coord.y}
                                                        r={20}
                                                        fill="none"
                                                        stroke="#f76d1b"
                                                        strokeWidth={2}
                                                        initial={{ scale: 0, opacity: 1 }}
                                                        animate={{ 
                                                            scale: [1, 1.5, 1.5],
                                                            opacity: [1, 0.5, 0]
                                                        }}
                                                        transition={{ 
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            ease: "easeOut"
                                                        }}
                                                    />
                                                    <motion.circle
                                                        cx={coord.x}
                                                        cy={coord.y}
                                                        r={20}
                                                        fill="none"
                                                        stroke="#f76d1b"
                                                        strokeWidth={2}
                                                        initial={{ scale: 0, opacity: 1 }}
                                                        animate={{ 
                                                            scale: [1, 1.5, 1.5],
                                                            opacity: [1, 0.5, 0]
                                                        }}
                                                        transition={{ 
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            ease: "easeOut",
                                                            delay: 0.5
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </g>
                                    );
                                })}
                            </AnimatePresence>
                        </svg>
                    </div>

                    {/* Stats panel with motion */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 p-4 bg-white rounded-lg shadow" 
                        style={{ maxWidth: MAP_WIDTH }}
                    >
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-gray-600">Algorithm</p>
                                <motion.p 
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="font-semibold text-lg"
                                >
                                    {algorithmData.algorithm}
                                </motion.p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Nodes Visited</p>
                                <motion.p 
                                    key={visitedNodes.length}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="font-semibold text-lg"
                                >
                              {visitedNodes.length} / {algorithmData.visitOrder?.length || algorithmData.levels?.flat().length || 0}
                                </motion.p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Distance</p>
                                <motion.p 
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="font-semibold text-lg"
                                >
                                    {algorithmData.totalDistance.toLocaleString()} miles
                                </motion.p>
                            </div>
                        </div>
                        <motion.div 
                            animate={{ 
                                opacity: isAnimating ? [1, 0.5, 1] : 1 
                            }}
                            transition={{ 
                                duration: 1.5, 
                                repeat: isAnimating ? Infinity : 0 
                            }}
                            className="mt-3 text-center"
                        >
                            <p className="text-sm font-medium">
                                {isAnimating ? 'Animating...' : '✓ Animation complete'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Start: {algorithmData.startCity}</p>
                        </motion.div>
                    </motion.div>
                </motion.div>
        </div>
    );
}

export default Map;