/**
 * @fileoverview Graph algorithm controllers - Handles all graph algorithm API endpoints
 * @module graphService
 * 
 * @example
 * // Usage examples:
 * // GET /api/dfs?startTeam=Minnesota Vikings
 * // GET /api/bfs?startTeam=Los Angeles Rams
 * // GET /api/dijkstra?startTeam=Green Bay Packers&endTeam=New England Patriots
 * // GET /api/astar?startTeam=Green Bay Packers&endTeam=New England Patriots
 * // GET /api/kruskal
*/

const { GraphService } = require('../models/Graph');
const Team = require('../models/Team');
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
 * Run Depth-First Search algorithm
 * Explores the graph starting from a given team using DFS traversal
 * 
 * @route GET /api/dfs
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startTeam='Minnesota Vikings'] - Starting team name
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and algorithm result data
 * @example
 * // Request: GET /api/dfs?startTeam=Green%20Bay%20Packers
 * // Response:
 * {
 *   success: true,
 *   data: {
 *     algorithm: 'DFS',
 *     startCity: 'Green Bay Packers',
 *     visitOrder: [...],
 *     discoveryEdges: [...],
 *     backEdges: [...],
 *     totalDistance: 1234.56
 *   }
 * }
 */
const runDFS = async (req, res) => {
    try {
        const { startTeam = 'Minnesota Vikings' } = req.query;

        // Fetch teams and distances
        const teams = await Team.find({}).lean();
        const distances = await mongoose.connection.db
            .collection('distances')
            .find({})
            .toArray();

        // Transform distances into edges format
        const edges = distances.map(dist => {
            const toTeam = getTeamFromStadium(dist.endingStadium, teams);
            return {
                from: dist.teamName,
                to: toTeam,
                distance: dist.distance
            };
        }).filter(edge => edge.to !== null); // Remove edges where we couldn't find the team

        // Create graph and run DFS
        const graphService = new GraphService(teams, edges);
        const result = graphService.runDFS(startTeam);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('DFS Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Run Breadth-First Search algorithm
 * Explores the graph starting from a given team using BFS traversal
 * 
 * @route GET /api/bfs
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startTeam='Minnesota Vikings'] - Starting team name
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and algorithm result data
 * @example
 * // Request: GET /api/bfs?startTeam=Los%20Angeles%20Rams
 * // Response:
 * {
 *   success: true,
 *   data: {
 *     algorithm: 'BFS',
 *     startCity: 'Los Angeles Rams',
 *     levels: [[...], [...]],
 *     discoveryEdges: [...],
 *     crossEdges: [...],
 *     totalDistance: 1234.56
 *   }
 * }
 */
const runBFS = async (req, res) => {
    try {
        const { startTeam = 'Minnesota Vikings' } = req.query;

        const teams = await Team.find({}).lean();
        const distances = await mongoose.connection.db
            .collection('distances')
            .find({})
            .toArray();

        const edges = distances.map(dist => {
            const toTeam = getTeamFromStadium(dist.endingStadium, teams);
            return {
                from: dist.teamName,
                to: toTeam,
                distance: dist.distance
            };
        }).filter(edge => edge.to !== null);

        const graphService = new GraphService(teams, edges);
        const result = graphService.runBFS(startTeam);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('BFS Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Run Dijkstra's shortest path algorithm
 * Finds shortest paths from start team to all teams or specific end team
 * 
 * @route GET /api/dijkstra
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startTeam='Green Bay Packers'] - Starting team name
 * @param {string} [req.query.endTeam] - Optional destination team name
 * @param {string} [req.query.detailed='false'] - Whether to include detailed path info
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and algorithm result data
 * @example
 * // Request: GET /api/dijkstra?startTeam=Green%20Bay%20Packers&endTeam=New%20England%20Patriots
 * // Response:
 * {
 *   success: true,
 *   algorithm: 'Dijkstra',
 *   timestamp: '2024-01-01T00:00:00.000Z',
 *   data: {
 *     algorithm: 'DIJKSTRA',
 *     startCity: 'Green Bay Packers',
 *     path: ['Green Bay Packers', '...', 'New England Patriots'],
 *     pathDistance: 1234.56,
 *     ...
 *   }
 * }
 */
const runDijkstra = async (req, res) => {
    try {
        const {
            startTeam = 'Green Bay Packers',
            endTeam,
            detailed = false
        } = req.query;

        // Fetch teams and distances from database
        const teams = await Team.find({}).lean();
        const distances = await mongoose.connection.db
            .collection('distances')
            .find({})
            .toArray();

        // Transform distances into edges format
        const edges = distances.map(dist => {
            const toTeam = getTeamFromStadium(dist.endingStadium, teams);
            return {
                from: dist.teamName,
                to: toTeam,
                distance: dist.distance
            };
        }).filter(edge => edge.to !== null);

        // Create graph service and run Dijkstra's
        const graphService = new GraphService(teams, edges);
        const result = graphService.runDijkstra(startTeam, endTeam);

        // Add detailed path info if requested and single target
        if (detailed === 'true' && endTeam && result.path) {
            result.detailedPath = graphService.getDetailedPath(
                result.parents,
                result.distances,
                startTeam,
                endTeam
            );
        }

        res.json({
            success: true,
            algorithm: 'Dijkstra',
            timestamp: new Date().toISOString(),
            data: result
        });

    } catch (error) {
        console.error('Dijkstra Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * Run A* search algorithm
 * Finds optimal path between two teams using heuristic-based search
 * Requires both startTeam and endTeam parameters
 * 
 * @route GET /api/astar
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startTeam='Green Bay Packers'] - Starting team name
 * @param {string} req.query.endTeam - Destination team name (required)
 * @param {string} [req.query.detailed='false'] - Whether to include detailed path info
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and algorithm result data
 * @example
 * // Request: GET /api/astar?startTeam=Green%20Bay%20Packers&endTeam=New%20England%20Patriots
 * // Response:
 * {
 *   success: true,
 *   algorithm: 'astar',
 *   timestamp: '2024-01-01T00:00:00.000Z',
 *   data: {
 *     algorithm: 'A*',
 *     startCity: 'Green Bay Packers',
 *     endCity: 'New England Patriots',
 *     path: [...],
 *     pathDistance: 1234.56,
 *     ...
 *   }
 * }
 */
const runAStar = async (req, res) => {
    try {
        const {
            startTeam = 'Green Bay Packers',
            endTeam,
            detailed = false
        } = req.query;

        // A* requires an endTeam
        if (!endTeam) {
            return res.status(400).json({
                success: false,
                error: 'A* algorithm requires both startTeam and endTeam parameters'
            });
        }

        // Fetch teams and distances from database
        const teams = await Team.find({}).lean();
        const distances = await mongoose.connection.db
            .collection('distances')
            .find({})
            .toArray();

        // Transform distances into edges format
        const edges = distances.map(dist => {
            const toTeam = getTeamFromStadium(dist.endingStadium, teams);
            return {
                from: dist.teamName,
                to: toTeam,
                distance: dist.distance
            };
        }).filter(edge => edge.to !== null);

        // Create graph service and run A*
        const graphService = new GraphService(teams, edges);
        const result = graphService.runAStar(startTeam, endTeam);

        res.json({
            success: true,
            algorithm: 'astar',
            timestamp: new Date().toISOString(),
            data: result
        });

    } catch (error) {
        console.error('A* Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

/**
 * Run Kruskal's Minimum Spanning Tree algorithm
 * Finds the minimum cost set of edges that connects all teams
 * 
 * @route GET /api/kruskal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and MST result data
 * @example
 * // Request: GET /api/kruskal
 * // Response:
 * {
 *   success: true,
 *   algorithm: 'Kruskal',
 *   timestamp: '2024-01-01T00:00:00.000Z',
 *   data: {
 *     algorithm: 'KRUSKAL',
 *     totalVertices: 32,
 *     totalEdges: 496,
 *     mstEdges: 31,
 *     totalDistance: 12345.67,
 *     discoveryEdges: [...],
 *     ...
 *   }
 * }
 */
const runKruskal = async (req, res) => {
    try {
        // Fetch teams and distances from database
        const teams = await Team.find({}).lean();
        const distances = await mongoose.connection.db
            .collection('distances')
            .find({})
            .toArray();

        // Transform distances into edges format
        const edges = distances.map(dist => {
            const toTeam = getTeamFromStadium(dist.endingStadium, teams);
            return {
                from: dist.teamName,
                to: toTeam,
                distance: dist.distance
            };
        }).filter(edge => edge.to !== null);

        // Create graph service and run Kruskal's
        const graphService = new GraphService(teams, edges);
        const result = graphService.runKruskal();

        res.json({
            success: true,
            algorithm: 'Kruskal',
            timestamp: new Date().toISOString(),
            data: result
        });

    } catch (error) {
        console.error('Kruskal Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = {
    runDFS,
    runBFS,
    runDijkstra,
    runAStar,
    runKruskal
};