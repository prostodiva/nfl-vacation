interface MapProps {
    algorithm: {
        type: string;
        team: string;
    } | null;
}

function Map({ algorithm }: MapProps) {
    if (!algorithm) {
        return (
            <div>
                <p>Please select an algorithm to begin</p>
            </div>
        );
    }
    return (
        <div>
            {algorithm.type === 'DFS' && (
                <div>Render DFS visualization</div>
            )}
            {algorithm.type === 'BFS' && (
                <div>Render BFS visualization</div>
            )}
            {algorithm.type === 'DIJKSTRA' && (
                <div>Render Dijkstra visualization</div>
            )}
        </div>
    );
}

export default Map;