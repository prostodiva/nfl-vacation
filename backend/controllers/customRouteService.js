const Team = require('../models/Team');
const mongoose = require('mongoose');

// Controller function for Custom Distance Route calculation
const calculateCustomRoute = async (req, res) => {
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

        // Build distance lookup by stadium names
        const distanceMap = {};
        distances.forEach(dist => {
            const key1 = `${dist.beginningStadium}-${dist.endingStadium}`;
            const key2 = `${dist.endingStadium}-${dist.beginningStadium}`;
            distanceMap[key1] = dist.distance;
            distanceMap[key2] = dist.distance;
        });

        let totalDistance = 0;
        const route = [];
        const edges = [];

        // Calculate sequential distance
        for (let i = 0; i < teamIds.length; i++) {
            const currentTeam = teamById[teamIds[i]];

            if (!currentTeam) {
                return res.status(400).json({
                    success: false,
                    error: `Team with ID ${teamIds[i]} not found`
                });
            }

            route.push(currentTeam.teamName);

            // Calculate distance to next team
            if (i < teamIds.length - 1) {
                const nextTeam = teamById[teamIds[i + 1]];
                const distanceKey = `${currentTeam.stadium.name}-${nextTeam.stadium.name}`;
                const distance = distanceMap[distanceKey];

                if (distance === undefined) {
                    return res.status(400).json({
                        success: false,
                        error: `Distance not available between ${currentTeam.teamName} and ${nextTeam.teamName}. Please reorder your teams or choose different teams.`
                    });
                }

                totalDistance += distance;
                edges.push({
                    from: currentTeam.teamName,
                    to: nextTeam.teamName,
                    distance: distance
                });
            }
        }

        res.json({
            success: true,
            data: {
                algorithm: 'CUSTOM',
                route: route,
                edges: edges,
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

module.exports = {
    calculateCustomRoute,
};
