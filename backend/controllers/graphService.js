
/*
// Usage:
// GET /api/graph/dfs?startTeam=Minnesota Vikings
// GET /api/graph/bfs?startTeam=Los Angeles Rams
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

module.exports = {
    runDFS,
    runBFS
};