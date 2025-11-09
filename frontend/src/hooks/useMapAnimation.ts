import { useState, useEffect } from 'react';
import { ANIMATION_CONFIG } from '../constants/mapConstants';
import type { AlgorithmData } from '../store/types/algorithmTypes';

export function useMapAnimation(algorithmData: AlgorithmData | null) {
    const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
    const [currentNode, setCurrentNode] = useState<string | null>(null);
    const [animatedEdges, setAnimatedEdges] = useState<string[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!algorithmData) return;

        // Reset state
        setVisitedNodes([]);
        setCurrentNode(null);
        setAnimatedEdges([]);
        setIsAnimating(true);

        const visitOrder = getVisitOrder(algorithmData);
        const { discoveryEdges } = algorithmData;

        let nodeIndex = 0;
        let edgeIndex = 0;

        const interval = setInterval(() => {
            if (nodeIndex < visitOrder.length) {
                const node = visitOrder[nodeIndex];
                setCurrentNode(node);
                setVisitedNodes(prev => [...prev, node]);

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
        }, ANIMATION_CONFIG.NODE_INTERVAL);

        return () => clearInterval(interval);
    }, [algorithmData]);

    return { visitedNodes, currentNode, animatedEdges, isAnimating };
}

function getVisitOrder(data: AlgorithmData): string[] {
    return data.visitOrder || data.levels?.flat() || [];
}