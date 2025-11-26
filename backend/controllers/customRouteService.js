const Team = require('../models/Team');
const { GraphService } = require('../models/Graph');
const mongoose = require('mongoose');

// Helper function to get team name from stadium name
const getTeamFromStadium = (stadiumName, teams) => {
    const team = teams.find(t => t.stadium?.name === stadiumName);
    return team ? team.teamName : null;
};

// Controller function for Custom Distance Route calculation using Dijkstra's
const calculateCustomRoute = async (req, res) => {
      console.log('🔥 RECURSIVE ROUTE HIT!'); 
    try {
        const { teamIds } = req.body;

        if (!teamIds || !Array.isArray(teamIds) || teamIds.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Please provide at least 2 teams in the route.'
            });
        }

        const teams = await Team.find({}).lean();
        const distances = await mongoose.connection.db
            .collection('distances')
            .find({})
            .toArray();

        // Build team lookup
        const teamById = {};
        teams.forEach(team => {
            teamById[team._id.toString()] = team;
        });

        // Transform distances into edges format for GraphService
        const graphEdges = distances.map(dist => {
            const toTeam = getTeamFromStadium(dist.endingStadium, teams);
            return {
                from: dist.teamName,
                to: toTeam,
                distance: dist.distance
            };
        }).filter(edge => edge.to !== null);

        // Create graph service
        const graphService = new GraphService(teams, graphEdges);

        let totalDistance = 0;
        const route = [];
        const routeEdges = [];

        // Use Dijkstra's algorithm to find shortest path between each consecutive pair
        for (let i = 0; i < teamIds.length - 1; i++) {
            const currentTeam = teamById[teamIds[i]];
            const nextTeam = teamById[teamIds[i + 1]];

            if (!currentTeam || !nextTeam) {
                return res.status(400).json({
                    success: false,
                    error: `Team with ID ${teamIds[i] || teamIds[i + 1]} not found`
                });
            }

            try {
                // Run Dijkstra's to find shortest path from current to next team
                const dijkstraResult = graphService.runDijkstra(
                    currentTeam.teamName,
                    nextTeam.teamName
                );

                // Get the path from current to next team
                const path = dijkstraResult.paths[nextTeam.teamName];
                
                if (!path || path.length === 0) {
                    return res.status(400).json({
                        success: false,
                        error: `No path found between ${currentTeam.teamName} and ${nextTeam.teamName}`
                    });
                }

                // Add path to route (avoid duplicates at connection points)
                if (i === 0) {
                    // First segment: add all nodes
                    route.push(...path);
                } else {
                    // Subsequent segments: skip first node (already in route)
                    route.push(...path.slice(1));
                }

                // Get distance from current to next team
                const segmentDistance = dijkstraResult.distances[nextTeam.teamName];
                
                if (segmentDistance === undefined || segmentDistance === Infinity) {
                    return res.status(400).json({
                        success: false,
                        error: `No path found between ${currentTeam.teamName} and ${nextTeam.teamName}`
                    });
                }

                totalDistance += segmentDistance;

                // Build edges for this segment
                for (let j = 0; j < path.length - 1; j++) {
                    const fromTeam = path[j];
                    const toTeam = path[j + 1];
                    
                    // Find the distance for this edge
                    const edgeDistance = graphEdges.find(e => 
                        (e.from === fromTeam && e.to === toTeam) ||
                        (e.from === toTeam && e.to === fromTeam)
                    )?.distance;

                    if (edgeDistance) {
                        routeEdges.push({
                            from: fromTeam,
                            to: toTeam,
                            distance: edgeDistance
                        });
                    }
                }

            } catch (error) {
                return res.status(400).json({
                    success: false,
                    error: `Error calculating path: ${error.message}`
                });
            }
        }

        res.json({
            success: true,
            data: {
                algorithm: 'DIJKSTRA',
                route: route,
                edges: routeEdges,
                totalDistance: Math.round(totalDistance * 100) / 100,
                teamCount: teamIds.length
            }
        });
    } catch (error) {
        console.error('Custom Route Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Recursive function to calculate shortest distance from New England Patriots
const calculateRecursiveRoute = async (req, res) => {
    try {
        const teams = await Team.find({}).lean();
        const distances = await mongoose.connection.db
            .collection('distances')
            .find({})
            .toArray();

        // Build team lookup
        const teamById = {};
        teams.forEach(team => {
            teamById[team._id.toString()] = team;
        });

        // Transform distances into edges format for GraphService
        const graphEdges = distances.map(dist => {
            const toTeam = getTeamFromStadium(dist.endingStadium, teams);
            return {
                from: dist.teamName,
                to: toTeam,
                distance: dist.distance
            };
        }).filter(edge => edge.to !== null);

        // Create graph service
        const graphService = new GraphService(teams, graphEdges);

        // Starting point
        const startTeam = 'New England Patriots';
        
        // Track visited teams to avoid cycles
        const visited = new Set([startTeam]);
        const route = [startTeam];
        const routeEdges = [];
        let totalDistance = 0;

        // Recursive helper function to find shortest unvisited neighbor
        const findShortestPath = (currentTeam) => {
            // Base case: all teams visited
            if (visited.size === teams.length) {
                return;
            }

            // Run Dijkstra from current team to find distances to all other teams
            const dijkstraResult = graphService.runDijkstra(currentTeam);
            
            // Find the closest unvisited team
            let closestTeam = null;
            let shortestDistance = Infinity;

            for (const team of teams) {
                const teamName = team.teamName;
                if (!visited.has(teamName)) {
                    const distance = dijkstraResult.distances[teamName];
                    if (distance !== undefined && distance < shortestDistance) {
                        shortestDistance = distance;
                        closestTeam = teamName;
                    }
                }
            }

            // If no unvisited team is reachable, stop
            if (closestTeam === null || shortestDistance === Infinity) {
                return;
            }

            // Get the path to the closest team
            const path = dijkstraResult.paths[closestTeam];
            
            // Add ALL edges from the Dijkstra path (including through visited cities)
            for (let i = 0; i < path.length - 1; i++) {
                const fromTeam = path[i];
                const toTeam = path[i + 1];
                
                // Find edge distance
                const edgeDistance = graphEdges.find(e => 
                    (e.from === fromTeam && e.to === toTeam) ||
                    (e.from === toTeam && e.to === fromTeam)
                )?.distance;

                if (edgeDistance) {
                    routeEdges.push({
                        from: fromTeam,
                        to: toTeam,
                        distance: edgeDistance
                    });
                }
            }
            
            // Add only NEW teams to the route (skip already visited)
            for (let i = 1; i < path.length; i++) {
                const currTeam = path[i];
                if (!visited.has(currTeam)) {
                    route.push(currTeam);
                    visited.add(currTeam);
                }
            }

            // Add distance
            totalDistance += shortestDistance;

            // Recursive call with the new current team
            findShortestPath(closestTeam);
        };

        // Start the recursive search
        findShortestPath(startTeam);

        res.json({
            success: true,
            data: {
                algorithm: 'RECURSIVE_NEAREST_NEIGHBOR',
                startTeam: startTeam,
                route: route,
                edges: routeEdges,
                totalDistance: Math.round(totalDistance * 100) / 100,
                teamCount: visited.size
            }
        });

    } catch (error) {
        console.error('Recursive Route Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    calculateCustomRoute,
    calculateRecursiveRoute
};
