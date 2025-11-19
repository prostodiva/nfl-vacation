import { motion, AnimatePresence } from 'framer-motion';
import mapImage from '../assets/map.svg';
import { useGetAlgorithmDataQuery } from '../store/apis/algorithmApi';
import { useMapAnimation } from '../hooks/useMapAnimation';
import { MapStats } from '../components/MapStats';
import { MAP_WIDTH, MAP_HEIGHT, stadiumCoordinates, ANIMATION_CONFIG, COLORS } from '../constants/mapConstants';
import type { MapProps } from '../store/types/algorithmTypes';


// Helper state components
function EmptyState() {
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

function ErrorState({ error }: { error: string }) {
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

function LoadingState() {
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

function Map({ algorithm }: MapProps) {
    const requiresEndTeam = algorithm?.type === 'DIJKSTRA' || algorithm?.type === 'A*';
    const hasEndTeam = !!algorithm?.endTeam;
    const shouldSkip = !algorithm || (requiresEndTeam && !hasEndTeam);

    const { data: response, isLoading, isError, error } = useGetAlgorithmDataQuery(
        {
            algorithmType: algorithm?.type || '',
            startTeam: algorithm?.team,
            endTeam: algorithm?.endTeam,
        },
        { skip: shouldSkip }
    );

    const algorithmData = response?.data || null;
    const { visitedNodes, currentNode, animatedEdges, isAnimating } = useMapAnimation(algorithmData);

    if (!algorithm) return <EmptyState />;
    // Show message if waiting for endTeam selection
    if (requiresEndTeam && !hasEndTeam) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8"
            >
                <p className="text-gray-600">Please select a destination team</p>
            </motion.div>
        );
    }

    if (isError) return <ErrorState error={(error as any)?.message || 'Error loading data'} />;
    if (isLoading || !algorithmData) return <LoadingState />;

    const visitOrder = algorithmData.visitOrder || algorithmData.levels?.flat() || [];

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
                                    stroke={COLORS.PRIMARY}
                                    initial={{
                                        pathLength: 0,
                                        strokeOpacity: 0,
                                        strokeWidth: 1
                                    }}
                                    animate={{
                                        pathLength: isAnimated ? 1 : 0,
                                        strokeOpacity: isAnimated ? 1 : 0,
                                        strokeWidth: isAnimated ? 2 : 1
                                    }}
                                    transition={{
                                        duration: ANIMATION_CONFIG.EDGE_DURATION,
                                        ease: "easeOut"
                                    }}
                                />
                            );
                        })}

                            {/* Render nodes with animation */}
                            <AnimatePresence>
                            {visitOrder.map((city) => {
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
                                            r={isCurrent ? ANIMATION_CONFIG.CURRENT_NODE_RADIUS : ANIMATION_CONFIG.DEFAULT_NODE_RADIUS}
                                            fill={COLORS.PRIMARY}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{
                                                scale: 1,
                                                opacity: 0.8,
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
                                                    r={ANIMATION_CONFIG.PULSE_RADIUS}
                                                    fill="none"
                                                    stroke={COLORS.PRIMARY}
                                                    strokeWidth={2}
                                                    initial={{ scale: 0, opacity: 1 }}
                                                    animate={{
                                                        scale: [1, 1.5, 1.5],
                                                        opacity: [1, 0.5, 0]
                                                    }}
                                                    transition={{
                                                        duration: ANIMATION_CONFIG.PULSE_DURATION,
                                                        repeat: Infinity,
                                                        ease: "easeOut"
                                                    }}
                                                />
                                                   <motion.circle
                                                    cx={coord.x}
                                                    cy={coord.y}
                                                    r={ANIMATION_CONFIG.PULSE_RADIUS}
                                                    fill="none"
                                                    stroke={COLORS.PRIMARY}
                                                    strokeWidth={2}
                                                    initial={{ scale: 0, opacity: 1 }}
                                                    animate={{
                                                        scale: [1, 1.5, 1.5],
                                                        opacity: [1, 0.5, 0]
                                                    }}
                                                    transition={{
                                                        duration: ANIMATION_CONFIG.PULSE_DURATION,
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

                      {/* Use MapStats component */}
                <MapStats
                    algorithmData={algorithmData}
                    visitedCount={visitedNodes.length}
                    totalNodes={visitOrder.length}
                    isAnimating={isAnimating}
                />
            </motion.div>
        </div>
    );
}

export default Map;