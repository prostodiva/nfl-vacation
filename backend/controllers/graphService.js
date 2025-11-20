
/*
// Usage:
// GET /api/dfs?startTeam=Minnesota Vikings
// GET /api/bfs?startTeam=Los Angeles Rams
// GET /api/dijkstra?startTeam=Green Bay Packers
// GET /api/A?startTeam=Green Bay Packers
*/

const { GraphService } = require('../models/Graph');
const Team = require('../models/Team');
const mongoose = require('mongoose');

// Helper function to get team name from stadium name
const getTeamFromStadium = (stadiumName, teams) => {
    const team = teams.find(t => t.stadium?.name === stadiumName);
    return team ? team.teamName : null;
};

// Controller function for DFS
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

// Controller function for BFS
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

// Controller for Dijkstra's shortest path
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

//controller function for A* from Green Bay Packers
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

// Controller function for Kruskal's Minimum Spanning Tree
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