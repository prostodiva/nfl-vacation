import { motion } from 'framer-motion';
import type { AlgorithmData } from '../store/types/algorithmTypes';

interface MapStatsProps {
    algorithmData: AlgorithmData;
    visitedCount: number;
    totalNodes: number;
    isAnimating: boolean;
}

export function MapStats({ 
    algorithmData, 
    visitedCount, 
    totalNodes, 
    isAnimating 
}: MapStatsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-4 bg-white rounded-md shadow mb-10"
        >
            <div className="grid grid-cols-1 gap-4 text-center h-50 w-30 text-[#3b3c5e]">
                <StatItem label="Algorithm" value={algorithmData.algorithm} />
                <StatItem 
                    label="Nodes Visited" 
                    value={`${visitedCount} / ${totalNodes}`}
                    animated
                />
                <StatItem 
                    label="Total Distance" 
                    value={`${algorithmData.totalDistance.toLocaleString()} miles`}
                />
            </div>

            <motion.div
                animate={{ opacity: isAnimating ? [1, 0.5, 1] : 1 }}
                transition={{ duration: 1.5, repeat: isAnimating ? Infinity : 0 }}
                className="mt-3 text-center"
            >
                <p className="text-sm font-medium">
                    {isAnimating ? 'Animating...' : '✓ Animation complete'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Start: {algorithmData.startCity}
                </p>
            </motion.div>
        </motion.div>
    );
}

function StatItem({ 
    label, 
    value, 
    animated = false 
}: { 
    label: string; 
    value: string; 
    animated?: boolean;
}) {
    return (
        <div>
            <p className="text-sm text-gray-600">{label}</p>
            <motion.p
                key={animated ? value : undefined}
                initial={{ scale: animated ? 1.2 : 0.8 }}
                animate={{ scale: 1 }}
                className="font-semibold text-lg"
            >
                {value}
            </motion.p>
        </div>
    );
}