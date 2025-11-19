export interface MapProps {
    algorithm: {
        type: 'DFS' | 'BFS' | 'DIJKSTRA' | 'A*' | 'kruskal';
        team?: string;
        endTeam?: string;
    } | null;
}

export interface TripProps {
    trip: {
        type: 'CUSTOM' | 'OPTIMAL' | 'Efficient';
        team: string;
    } | null;
}

export interface AlgorithmData {
    algorithm: string;
    startCity: string;
    visitOrder?: string[];
    levels?: string[][];
    discoveryEdges: Edge[];
    backEdges?: Edge[];
    crossEdges?: Edge[];
    totalDistance: number;
}

export interface Edge {
    from: string;
    to: string;
    distance: number;
}

export interface Coordinate {
    x: number;
    y: number;
}

export type StadiumCoordinates = Record<string, Coordinate>;

export interface CustomRouteRequest {
    teamIds: string[];
}

export interface CustomRouteData {
    algorithm: string;
    route: string[];
    edges: Edge[];
    totalDistance: number;
    teamCount: number;
}

export interface CustomRouteResponse {
    success: boolean;
    data: CustomRouteData;
}