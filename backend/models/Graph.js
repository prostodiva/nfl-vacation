/**
 * @fileoverview GraphService class for running graph algorithms on NFL teams
 * @module GraphService
 */

const mongoose = require('mongoose');
const { PriorityQueue, UnionFind } = require('../utils/dataStructures');
const { stadiumCoordinates } = require('../utils/stadiumCoordinates');

/**
 * GraphService class for executing graph algorithms
 * Implements DFS, BFS, Dijkstra's, A*, and Kruskal's algorithms
 * Uses adjacency matrix representation for graph storage
 * 
 * @class GraphService
 */
class GraphService {

    /**
     * Creates a new GraphService instance
     * @param {Array<Object>} teams - Array of team objects
     * @param {Array<Object>} edges - Array of edge objects with distance information
     * @constructor
     */
    constructor(teams, edges) {
        /** @type {Array<Object>} Array of team objects */
        this.teams = teams;
        /** @type {Array<Object>} Array of edge objects */
        this.edges = edges;
        /** @type {Array<Array<number>>|null} Adjacency matrix representation */
        this.adjacencyMatrix = null;
        /** @type {Array<string>} Array of team names indexed by position */
        this.teamNames = [];
        /** @type {Object<string, number>} Map from team name to index */
        this.nameToIndex = {};
        /** @type {Object<string, number>} Map from team ID to index */
        this.idToIndex = {};

        this.buildGraph();
    }

    /**
     * Builds the adjacency matrix from teams and edges
     * Creates mappings for team names and IDs to matrix indices
     * @returns {void}
     * @timeComplexity O(N² + E) where N = teams, E = edges
     */
    buildGraph() {
        // Build team mappings
        this.teams.forEach((team, index) => {
            const teamName = team.teamName || team.name;
            this.teamNames[index] = teamName;
            this.nameToIndex[teamName] = index;
            this.idToIndex[team._id || team.id] = index;
        });

        // Initialize adjacency matrix
        const N = this.teams.length;
        this.adjacencyMatrix = Array(N).fill(0).map(() => Array(N).fill(0));

        // Fill matrix with edges
        this.edges.forEach(edge => {
            let fromIndex, toIndex;

            // Handle different edge formats
            if (edge.from && edge.to) {
                // Edge has team names directly
                fromIndex = this.nameToIndex[edge.from];
                toIndex = this.nameToIndex[edge.to];
            } else if (edge.teamFrom && edge.teamTo) {
                // Edge has cteam IDs
                fromIndex = this.idToIndex[edge.teamFrom];
                toIndex = this.idToIndex[edge.teamTo];
            } else if (edge.fromCity && edge.toCity) {
                // Alternative naming
                fromIndex = this.nameToIndex[edge.fromTeam];
                toIndex = this.nameToIndex[edge.toTeam];
            }

            const distance = edge.distance || edge.weight || edge.mileage;

            if (fromIndex !== undefined && toIndex !== undefined) {
                this.adjacencyMatrix[fromIndex][toIndex] = distance;
                this.adjacencyMatrix[toIndex][fromIndex] = distance; // Undirected
            }
        });
    }

// ==================== DFS ALGORITHM ====================

    /**
     * Runs Depth-First Search algorithm starting from a given team
     * Explores the graph by going as deep as possible before backtracking
     * 
     * @param {string} startTeamName - Name of the starting team
     * @returns {Object} Result object containing:
     *   - algorithm: 'DFS'
     *   - startCity: Starting team name
     *   - visitOrder: Array of teams visited in order
     *   - discoveryEdges: Array of edges used in traversal
     *   - backEdges: Array of back edges found
     *   - totalDistance: Total distance traveled
     * @throws {Error} If startTeamName is not found
     * @timeComplexity O(N²) where N = number of teams
     * @spaceComplexity O(N + E) for visited array and recursion stack
     */
    runDFS(startTeamName) {
        const startIndex = this.nameToIndex[startTeamName];
        if (startIndex === undefined) {
            throw new Error(`Team "${startTeamName}" not found`);
        }

        const N = this.adjacencyMatrix.length;
        const visited = Array(N).fill(false);
        const processedEdges = new Set();
        let totalDistance = 0;

        const result = {
            algorithm: 'DFS',
            startCity: startTeamName,
            visitOrder: [],
            discoveryEdges: [],
            backEdges: [],
            totalDistance: 0
        };

        const dfsVisit = (currentIndex) => {
            if (visited[currentIndex]) return;

            const teamName = this.teamNames[currentIndex];
            visited[currentIndex] = true;
            result.visitOrder.push(teamName);

            // Get and sort neighbors by distance (smallest first)
            const neighbors = [];
            for (let i = 0; i < N; i++) {
                if (this.adjacencyMatrix[currentIndex][i] > 0) {
                    neighbors.push({
                        index: i,
                        distance: this.adjacencyMatrix[currentIndex][i]
                    });
                }
            }
            neighbors.sort((a, b) => a.distance - b.distance);

            // Process each neighbor
            for (const neighbor of neighbors) {
                const edgeKey = currentIndex < neighbor.index
                    ? `${currentIndex}-${neighbor.index}`
                    : `${neighbor.index}-${currentIndex}`;

                if (processedEdges.has(edgeKey)) continue;
                processedEdges.add(edgeKey);

                const edgeData = {
                    from: teamName,
                    to: this.teamNames[neighbor.index],
                    distance: neighbor.distance
                };

                if (!visited[neighbor.index]) {
                    result.discoveryEdges.push(edgeData);
                    totalDistance += neighbor.distance;
                    dfsVisit(neighbor.index);
                } else {
                    result.backEdges.push(edgeData);
                }
            }
        };

        dfsVisit(startIndex);
        result.totalDistance = totalDistance;

        return result;
    }

    // ==================== BFS ALGORITHM ====================

    /**
     * Runs Breadth-First Search algorithm starting from a given team
     * Explores the graph level by level
     * 
     * @param {string} startTeamName - Name of the starting team
     * @returns {Object} Result object containing:
     *   - algorithm: 'BFS'
     *   - startCity: Starting team name
     *   - levels: Array of arrays representing each level
     *   - discoveryEdges: Array of edges used in traversal
     *   - crossEdges: Array of cross edges found
     *   - totalDistance: Total distance traveled
     * @throws {Error} If startTeamName is not found
     * @timeComplexity O(N²) where N = number of teams
     * @spaceComplexity O(N) for queue and visited array
     */
    runBFS(startTeamName) {
        const startIndex = this.nameToIndex[startTeamName];
        if (startIndex === undefined) {
            throw new Error(`Team "${startTeamName}" not found`);
        }

        const N = this.adjacencyMatrix.length;
        const visited = Array(N).fill(false);
        const processedEdges = new Set();
        let totalDistance = 0;

        const result = {
            algorithm: 'BFS',
            startCity: startTeamName,
            levels: [],
            discoveryEdges: [],
            crossEdges: [],
            totalDistance: 0
        };

        const queue = [[startIndex]]; // Level 0
        visited[startIndex] = true;
        result.levels.push([startTeamName]);

        let levelNum = 0;

        while (levelNum < queue.length) {
            const currentLevel = queue[levelNum];
            const nextLevel = [];

            for (const currentIndex of currentLevel) {
                const teamName = this.teamNames[currentIndex];

                // Get and sort neighbors by distance
                const neighbors = [];
                for (let i = 0; i < N; i++) {
                    if (this.adjacencyMatrix[currentIndex][i] > 0) {
                        neighbors.push({
                            index: i,
                            distance: this.adjacencyMatrix[currentIndex][i]
                        });
                    }
                }
                neighbors.sort((a, b) => a.distance - b.distance);

                for (const neighbor of neighbors) {
                    const edgeKey = currentIndex < neighbor.index
                        ? `${currentIndex}-${neighbor.index}`
                        : `${neighbor.index}-${currentIndex}`;

                    if (processedEdges.has(edgeKey)) continue;
                    processedEdges.add(edgeKey);

                    const edgeData = {
                        from: teamName,
                        to: this.teamNames[neighbor.index],
                        distance: neighbor.distance
                    };

                    if (!visited[neighbor.index]) {
                        visited[neighbor.index] = true;
                        nextLevel.push(neighbor.index);
                        result.discoveryEdges.push(edgeData);
                        totalDistance += neighbor.distance;
                    } else {
                        result.crossEdges.push(edgeData);
                    }
                }
            }

            if (nextLevel.length > 0) {
                queue.push(nextLevel);
                result.levels.push(nextLevel.map(idx => this.teamNames[idx]));
            }

            levelNum++;
        }

        result.totalDistance = totalDistance;
        return result;
    }

    // Helper method to get both algorithms at once
    runBothAlgorithms(startTeamName) {
        return {
            dfs: this.runDFS(startTeamName),
            bfs: this.runBFS(startTeamName)
        };
    }

    // ==================== DIJKSTRA'S ALGORITHM ====================

    /**
     * Runs Dijkstra's shortest path algorithm
     * Finds shortest paths from start team to all other teams (or specific end team)
     * Uses PriorityQueue for efficient implementation
     * 
     * @param {string} startTeamName - Name of the starting team
     * @param {string|null} [endTeamName=null] - Optional end team name for single destination
     * @returns {Object} Result object containing:
     *   - algorithm: 'DIJKSTRA'
     *   - startCity: Starting team name
     *   - distances: Object mapping team names to shortest distances
     *   - paths: Object mapping team names to shortest paths
     *   - discoveryEdges: Array of edges in shortest paths
     *   - visitOrder: Array of teams visited in order
     *   - totalDistance: Total distance (if endTeam specified, distance to end)
     * @throws {Error} If startTeamName is not found
     * @timeComplexity O(N² log N) where N = number of teams
     * @spaceComplexity O(N²) for adjacency matrix + O(N) for arrays
     */
    runDijkstra(startTeamName, endTeamName = null) {
        const startIndex = this.nameToIndex[startTeamName];
        if (startIndex === undefined) {
            throw new Error(`Team "${startTeamName}" not found`);
        }

        const N = this.adjacencyMatrix.length;
        const distances = Array(N).fill(Infinity);
        const previous = Array(N).fill(null);
        const visited = Array(N).fill(false);

        distances[startIndex] = 0;

        const pq = new PriorityQueue();
        pq.enqueue(startIndex, 0);

        while (!pq.isEmpty()) {
            const currentIndex = pq.dequeue();

            if (visited[currentIndex]) continue;
            visited[currentIndex] = true;

            if (endTeamName && this.teamNames[currentIndex] === endTeamName) {
                break;
            }

            for (let neighborIndex = 0; neighborIndex < N; neighborIndex++) {
                const weight = this.adjacencyMatrix[currentIndex][neighborIndex];

                if (weight > 0 && !visited[neighborIndex]) {
                    const newDistance = distances[currentIndex] + weight;

                    if (newDistance < distances[neighborIndex]) {
                        distances[neighborIndex] = newDistance;
                        previous[neighborIndex] = currentIndex;
                        pq.enqueue(neighborIndex, newDistance);
                    }
                }
            }
        }

        // Build result
        const result = {
            algorithm: 'DIJKSTRA',
            startCity: startTeamName,
            distances: {},
            paths: {},
            discoveryEdges: [],
            visitOrder: [],
            totalDistance: 0
        };

        // If endTeam is specified, only build path to that team
        if (endTeamName) {
            const endIndex = this.nameToIndex[endTeamName];
            
            if (endIndex !== undefined && distances[endIndex] !== Infinity) {
                // Build path from start to end
                const path = [];
                let current = endIndex;
                while (current !== null) {
                    path.unshift(this.teamNames[current]);
                    current = previous[current];
                }
                
                result.path = path;
                result.paths[endTeamName] = path;
                result.distances[endTeamName] = distances[endIndex];
                
                // Build visit order (only nodes on the path)
                result.visitOrder = [...path];
                
                // Build discovery edges for the path
                for (let i = 1; i < path.length; i++) {
                    const fromIndex = this.nameToIndex[path[i - 1]];
                    const toIndex = this.nameToIndex[path[i]];
                    result.discoveryEdges.push({
                        from: path[i - 1],
                        to: path[i],
                        distance: this.adjacencyMatrix[fromIndex][toIndex]
                    });
                }
                
                result.totalDistance = distances[endIndex];
            } else {
                // Path not found
                result.visitOrder = [];
            }
        } else {
            // No endTeam specified - build spanning tree (original behavior)
            const sortedNodes = [];
            for (let i = 0; i < N; i++) {
                if (distances[i] !== Infinity) {
                    sortedNodes.push({ name: this.teamNames[i], distance: distances[i] });
                }
            }
            sortedNodes.sort((a, b) => a.distance - b.distance);
            result.visitOrder = sortedNodes.map(node => node.name);

            // Collect unique edges from previous array (only once per destination)
            for (let i = 0; i < N; i++) {
                if (distances[i] !== Infinity) {
                    result.distances[this.teamNames[i]] = distances[i];

                    // Build path for this destination
                    const path = [];
                    let current = i;
                    while (current !== null) {
                        path.unshift(this.teamNames[current]);
                        current = previous[current];
                    }
                    result.paths[this.teamNames[i]] = path;

                    // Add edge to discoveryEdges (ONLY ONCE per destination)
                    if (previous[i] !== null) {
                        result.discoveryEdges.push({
                            from: this.teamNames[previous[i]],
                            to: this.teamNames[i],
                            distance: this.adjacencyMatrix[previous[i]][i]
                        });
                    }
                }
            }

            // Calculate total (sum of all unique edges in spanning tree)
            result.totalDistance = result.discoveryEdges.reduce((sum, edge) => sum + edge.distance, 0);
        }

        return result;
    }

    // ==================== A* ALGORITHM ====================

    /**
     * Runs A* search algorithm for finding optimal path
     * Uses heuristic function based on stadium coordinates
     * More efficient than Dijkstra's when searching for specific destination
     * 
     * @param {string} startTeamName - Name of the starting team
     * @param {string} endTeamName - Name of the destination team
     * @returns {Object} Result object containing:
     *   - algorithm: 'A*'
     *   - startCity: Starting team name
     *   - endCity: Destination team name
     *   - path: Array of team names in optimal path
     *   - pathDistance: Total distance of optimal path
     *   - discoveryEdges: Array of edges in the path
     *   - visitOrder: Array of teams visited during search
     * @throws {Error} If startTeamName or endTeamName is not found, or if endTeamName is missing
     * @timeComplexity O(N² log N) worst case, but typically better than Dijkstra's
     * @spaceComplexity O(N²) for adjacency matrix + O(N) for arrays
     */
    runAStar(startTeamName, endTeamName) {
        if (!endTeamName) {
            throw new Error('A* algorithm requires both startTeam and endTeam');
        }

        const startIndex = this.nameToIndex[startTeamName];
        const endIndex = this.nameToIndex[endTeamName];

        if (startIndex === undefined) {
            throw new Error(`Team "${startTeamName}" not found`);
        }
        if (endIndex === undefined) {
            throw new Error(`Team "${endTeamName}" not found`);
        }

        const N = this.adjacencyMatrix.length;

        // g(n) = actual distance from start to current node
        const gScore = Array(N).fill(Infinity);
        // f(n) = g(n) + h(n) = estimated total distance
        const fScore = Array(N).fill(Infinity);
        const previous = Array(N).fill(null);
        const visited = Array(N).fill(false);

        gScore[startIndex] = 0;
        fScore[startIndex] = this.heuristic(startIndex, endIndex);

        // Priority queue ordered by f(n) = g(n) + h(n)
        const pq = new PriorityQueue();
        pq.enqueue(startIndex, fScore[startIndex]);

        while (!pq.isEmpty()) {
            const currentIndex = pq.dequeue();

            if (visited[currentIndex]) continue;
            visited[currentIndex] = true;

            // If we reached the goal, reconstruct path
            if (currentIndex === endIndex) {
                break;
            }

            // Explore neighbors
            for (let neighborIndex = 0; neighborIndex < N; neighborIndex++) {
                const weight = this.adjacencyMatrix[currentIndex][neighborIndex];

                if (weight > 0 && !visited[neighborIndex]) {
                    // Calculate tentative g score
                    const tentativeGScore = gScore[currentIndex] + weight;

                    // If this path to neighbor is better, update it
                    if (tentativeGScore < gScore[neighborIndex]) {
                        previous[neighborIndex] = currentIndex;
                        gScore[neighborIndex] = tentativeGScore;
                        fScore[neighborIndex] = tentativeGScore + this.heuristic(neighborIndex, endIndex);
                        pq.enqueue(neighborIndex, fScore[neighborIndex]);
                    }
                }
            }
        }

        // Build result
        const result = {
            algorithm: 'A*',
            startCity: startTeamName,
            endCity: endTeamName,
            distances: {},
            paths: {},
            discoveryEdges: [],
            visitOrder: [],
            totalDistance: 0,
            path: null,
            pathDistance: gScore[endIndex] === Infinity ? null : gScore[endIndex]
        };

        // Build visit order (nodes visited during search)
        for (let i = 0; i < N; i++) {
            if (visited[i]) {
                result.visitOrder.push(this.teamNames[i]);
            }
        }

        // Reconstruct path from start to end
        if (gScore[endIndex] !== Infinity) {
            const path = [];
            let current = endIndex;
            while (current !== null) {
                path.unshift(this.teamNames[current]);
                current = previous[current];
            }
            result.path = path;
            result.paths[endTeamName] = path;
            result.distances[endTeamName] = gScore[endIndex];

            // Build discovery edges for the path
            for (let i = 1; i < path.length; i++) {
                const fromIndex = this.nameToIndex[path[i - 1]];
                const toIndex = this.nameToIndex[path[i]];
                result.discoveryEdges.push({
                    from: path[i - 1],
                    to: path[i],
                    distance: this.adjacencyMatrix[fromIndex][toIndex]
                });
            }
            result.totalDistance = gScore[endIndex];
        }

        return result;
    }

    /**
     * Heuristic function for A* algorithm
     * Estimates distance using Euclidean distance between stadium coordinates
     * 
     * @param {number} currentIndex - Index of current team
     * @param {number} goalIndex - Index of goal team
     * @returns {number} Estimated distance (Euclidean distance in pixel space)
     * @timeComplexity O(1)
     * @private
     */
    heuristic(currentIndex, goalIndex) {
        const currentTeam = this.teamNames[currentIndex];
        const goalTeam = this.teamNames[goalIndex];

        const currentCoords = stadiumCoordinates[currentTeam];
        const goalCoords = stadiumCoordinates[goalTeam];

        if (currentCoords && goalCoords) {
            // Calculate Euclidean distance in pixel space
            const dx = currentCoords.x - goalCoords.x;
            const dy = currentCoords.y - goalCoords.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
        return 0;
    }

    // ==================== KRUSKAL'S ALGORITHM ====================

    /**
     * Runs Kruskal's algorithm to find Minimum Spanning Tree (MST)
     * Finds the minimum cost set of edges that connects all teams
     * Uses UnionFind data structure to detect cycles
     * 
     * @returns {Object} Result object containing:
     *   - algorithm: 'KRUSKAL'
     *   - totalVertices: Number of vertices (teams)
     *   - totalEdges: Total number of edges in graph
     *   - mstEdges: Number of edges in MST
     *   - totalDistance: Total weight of MST
     *   - discoveryEdges: Array of edges in MST
     *   - visitOrder: Array of all teams in MST
     *   - sortedEdges: All edges sorted by weight
     *   - processedEdges: Array showing which edges were added/rejected
     * @timeComplexity O(E log E) where E = number of edges (dominated by sorting)
     * @spaceComplexity O(N²) for adjacency matrix + O(E) for edges
     */
    runKruskal() {
        const N = this.adjacencyMatrix.length;
        
        // Step 1: Extract all unique edges from adjacency matrix
        const allEdges = [];
        
        for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) { // Only upper triangle to avoid duplicates
                const weight = this.adjacencyMatrix[i][j];
                if (weight > 0) {
                    allEdges.push({
                        from: i,
                        to: j,
                        weight: weight
                    });
                }
            }
        }

        // Step 2: Sort edges by weight
        allEdges.sort((a, b) => a.weight - b.weight);

        // Step 3: Initialize Union-Find
        const uf = new UnionFind(N);

        // Step 4: Build MST
        const mstEdges = [];
        let totalWeight = 0;
        const processedEdges = [];

        for (const edge of allEdges) {
            const fromName = this.teamNames[edge.from];
            const toName = this.teamNames[edge.to];
            
            // Try to add edge to MST
            if (uf.unite(edge.from, edge.to)) {
                // No cycle - add to MST
                mstEdges.push({
                    from: fromName,
                    to: toName,
                    distance: edge.weight
                });
                totalWeight += edge.weight;
                
                processedEdges.push({
                    from: fromName,
                    to: toName,
                    distance: edge.weight,
                    action: 'ADDED'
                });

                // Stop if we have N-1 edges (complete MST)
                if (mstEdges.length === N - 1) {
                    break;
                }
            } else {
                // Would create cycle - reject
                processedEdges.push({
                    from: fromName,
                    to: toName,
                    distance: edge.weight,
                    action: 'REJECTED (cycle)'
                });
            }
        }

        // Extract all unique nodes from MST edges for visitOrder
        const mstNodes = new Set();
        mstEdges.forEach(edge => {
            mstNodes.add(edge.from);
            mstNodes.add(edge.to);
        });

        // Build result matching AlgorithmData interface
        const result = {
            algorithm: 'KRUSKAL',
            startCity: 'MST', // Not applicable, but required by interface
            totalVertices: N,
            totalEdges: allEdges.length,
            mstEdges: mstEdges.length,
            totalDistance: Math.round(totalWeight * 100) / 100,
            // Map edges to discoveryEdges for Map component
            discoveryEdges: mstEdges,
            // Create visitOrder from all nodes in MST
            visitOrder: Array.from(mstNodes),
            // Keep original structure for API response
            edges: mstEdges,
            sortedEdges: allEdges.map((edge, index) => ({
                rank: index + 1,
                from: this.teamNames[edge.from],
                to: this.teamNames[edge.to],
                distance: edge.weight
            })),
            processedEdges: processedEdges
        };

        return result;
    }
}



if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GraphService };
}