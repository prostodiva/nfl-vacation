/**
 * @fileoverview Custom route service controller - Handles custom and recursive route calculations
 * @module customRouteService
 */

const Team = require('../models/Team');
const { GraphService } = require('../models/Graph');
const mongoose = require('mongoose');

/**
 * Helper function to get team name from stadium name
 * @param {string} stadiumName - Name of the stadium
 * @param {Array<Object>} teams - Array of team objects
 * @returns {string|null} Team name or null if not found
 * @private
 */
const getTeamFromStadium = (stadiumName, teams) => {
    const team = teams.find(t => t.stadium?.name === stadiumName);
    return team ? team.teamName : null;
};

/**
 * Calculate custom route
 * Calculates optimal route between multiple teams using Dijkstra's algorithm
 * Finds shortest path between each consecutive pair of teams
 * 
 * @route POST /api/custom-route
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {Array<string>} req.body.teamIds - Array of team IDs in desired order
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and route data
 * @example
 * // Request: POST /api/custom-route
 * // Body: { teamIds: ['id1', 'id2', 'id3'] }
 * // Response:
 * {
 *   success: true,
 *   data: {
 *     route: ['Team1', 'Team2', 'Team3'],
 *     totalDistance: 1234.56,
 *     routeEdges: [...]
 *   }
 * }
 */
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

        // Build team lookup using Map
        const teamById = new Map();
        teams.forEach(team => {
            teamById.set(team._id.toString(), team);
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
            const currentTeam = teamById.get(teamIds[i]);
            const nextTeam = teamById.get(teamIds[i + 1]);

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

/**
 * Calculate recursive route
 * Calculates a route visiting all teams starting from New England Patriots
 * Uses greedy approach: always visits the closest unvisited team
 * 
 * @route POST /api/recursive
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and route data
 * @example
 * // Request: POST /api/recursive
 * // Response:
 * {
 *   success: true,
 *   data: {
 *     algorithm: 'DIJKSTRA',
 *     route: ['New England Patriots', '...', '...'],
 *     totalDistance: 12345.67,
 *     routeEdges: [...]
 *   }
 * }
 */
const calculateRecursiveRoute = async (req, res) => {
    try {
        const { teamIds } = req.body || {}; // Handle undefined req.body
        
        const teams = await Team.find({}).lean();
        const distances = await mongoose.connection.db
            .collection('distances')
            .find({})
            .toArray();

        // Build team lookup using Map
        const teamById = new Map();
        teams.forEach(team => {
            teamById.set(team._id.toString(), team);
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

        // Filter teams if teamIds provided, otherwise use all teams
        const teamsToVisit = teamIds && teamIds.length > 0
            ? teams.filter(team => teamIds.includes(team._id.toString()))
            : teams;

        if (teamsToVisit.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Please provide at least 2 teams in the route.'
            });
        }

        // Starting point - use first team from selection, or default to New England Patriots
        const startTeam = teamIds && teamIds.length > 0 && teamsToVisit.length > 0
            ? teamsToVisit[0].teamName
            : 'New England Patriots';
        
        // Track visited teams to avoid cycles
        const visited = new Set([startTeam]);
        const route = [startTeam];
        const routeEdges = [];
        let totalDistance = 0;

        // Recursive helper function to find shortest unvisited neighbor
        const findShortestPath = (currentTeam) => {
            // Base case: all selected teams visited
            if (visited.size === teamsToVisit.length) {
                return;
            }

            // Run Dijkstra from current team to find distances to all other teams
            const dijkstraResult = graphService.runDijkstra(currentTeam);
            
            // Find the closest unvisited team (from selected teams only)
            let closestTeam = null;
            let shortestDistance = Infinity;

            for (const team of teamsToVisit) {
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
            
            // Create a set of selected team names for quick lookup
            // When teamIds is not provided (Optimal trip), this will include all teams
            const selectedTeamNames = new Set(teamsToVisit.map(t => t.teamName));
            
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
            
            // Add only NEW teams to the route that are in the selected teams list
            // For Optimal trip (all teams), this will add all teams
            // For Efficient trip (selected teams), this will only add selected teams
            for (let i = 1; i < path.length; i++) {
                const currTeam = path[i];
                // Only add if it's a selected team and not already visited
                if (selectedTeamNames.has(currTeam) && !visited.has(currTeam)) {
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
