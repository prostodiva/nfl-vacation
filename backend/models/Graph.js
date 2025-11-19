const mongoose = require('mongoose');
const { PriorityQueue } = require('../utils/dataStructures');
const { stadiumCoordinates } = require('../utils/stadiumCoordinates');

class GraphService {

    constructor(teams, edges) {
        this.teams = teams;
        this.edges = edges;
        this.adjacencyMatrix = null;
        this.teamNames = [];
        this.nameToIndex = {};
        this.idToIndex = {};

        this.buildGraph();
    }

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

    // Heuristic function: estimates distance from current to goal
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
}


// 1: Express.js Route Handler
    async function

    graphAlgorithmsHandler(req, res) {
        try {
            const {startTeam = 'Minnesota Vikings'} = req.query;

            // Fetch data from your existing MongoDB endpoints
            const teams = await fetch('/api/teams').then(r => r.json());
            const edges = await fetch('/api/edges').then(r => r.json());

            // Initialize graph service
            const graphService = new GraphService(teams, edges);

            // Run algorithms
            const results = graphService.runBothAlgorithms(startTeam);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

// 2: Separate endpoint for each algorithm
async function dfsHandler(req, res) {
    try {
        const { startTeam = 'Minnesota Vikings' } = req.query;
        const teams = await fetch('/api/teams').then(r => r.json());
        const edges = await fetch('/api/edges').then(r => r.json());
        
        const graphService = new GraphService(teams, edges);
        const result = graphService.runDFS(startTeam);
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function bfsHandler(req, res) {
    try {
        const { startTeam = 'Los Angeles Rams' } = req.query;
        const teams = await fetch('/api/teams').then(r => r.json());
        const edges = await fetch('/api/edges').then(r => r.json());
        
        const graphService = new GraphService(teams, edges);
        const result = graphService.runBFS(startTeam);
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


// 3 : Using with axios or fetch 
async function runGraphAlgorithms(startCity = 'Los Angeles Rams') {
    try {
        // Use your existing API endpoints
        const [teamsResponse, edgesResponse] = await Promise.all([
            fetch('/api/teams'),
            fetch('/api/edges')
        ]);
        
        const teams = await teamsResponse.json();
        const edges = await edgesResponse.json();
        
        // Create graph service
        const graphService = new GraphService(teams, edges);
        
        // Run DFS
        const dfsResult = graphService.runDFS(startTeam);
        console.log('DFS Results:', dfsResult);
        
        // Run BFS
        const bfsResult = graphService.runBFS(startTeam);
        console.log('BFS Results:', bfsResult);
        
        return { dfs: dfsResult, bfs: bfsResult };
    } catch (error) {
        console.error('Error running algorithms:', error);
        throw error;
    }
}

// Example 4: Direct usage with MongoDB data
async function runWithMongoData(teamsCollection, edgesCollection) {
    // Fetch from your MongoDB collections
    const teams = await teamsCollection.find({}).toArray();
    const edges = await edgesCollection.find({}).toArray();
    
    // Run algorithms
    const graphService = new GraphService(cities, edges);
    return graphService.runBothAlgorithms('Los Angeles Rams');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GraphService };
}