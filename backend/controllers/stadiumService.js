const Team = require('../models/Team');

// Returns unique stadiums (if two teams share a stadium, count once)
const getStadiumsByRoofType = async (req, res) => {
  try {
    const { roofType } = req.query;
    
    // Validate roofType - only accept what's in the database
    const validRoofTypes = ['Open', 'Fixed', 'Retractable'];
    if (!roofType || !validRoofTypes.includes(roofType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid roofType. Must be one of: ${validRoofTypes.join(', ')}`
      });
    }
    
    // Get all teams with specified roof type
    const teams = await Team.find({ 'stadium.roofType': roofType })
      .sort({ 'stadium.name': 1 }); // Sort by stadium name
    
    // Create a map to track unique stadiums
    const uniqueStadiums = new Map();
    
    teams.forEach(team => {
      const stadiumName = team.stadium.name;
      // Only add if we haven't seen this stadium before
      if (!uniqueStadiums.has(stadiumName)) {
        uniqueStadiums.set(stadiumName, {
          stadiumName: stadiumName,
          teamName: team.teamName,
          location: team.stadium.location,
          seatingCapacity: team.stadium.seatingCapacity,
          yearOpened: team.stadium.yearOpened,
          roofType: team.stadium.roofType, // Include roofType in response
          surfaceType: team.stadium.surfaceType // Include surfaceType for completeness
        });
      } else {
        // If stadium already exists, add team name to show it's shared
        const existing = uniqueStadiums.get(stadiumName);
        if (!existing.teams) {
          existing.teams = [existing.teamName];
        }
        existing.teams.push(team.teamName);
        existing.teamName = existing.teams.join(', '); // Show all teams sharing the stadium
      }
    });
    
    // Convert map to array and sort by stadium name
    const stadiumList = Array.from(uniqueStadiums.values())
      .sort((a, b) => a.stadiumName.localeCompare(b.stadiumName));
    
    res.status(200).json({
      success: true,
      count: stadiumList.length, // Unique stadium count
      totalTeams: teams.length,   // Total teams with this roof type
      roofType: roofType,         // Include roofType in response
      data: stadiumList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stadiums by roof type',
      error: error.message
    });
  }
};

const getAllStadiums = async (req, res) => {
  try {
    // Get all teams (no roof type filter)
    const teams = await Team.find({})
      .sort({ 'stadium.name': 1 }); // Sort by stadium name

    // Create a map to track unique stadiums
    const uniqueStadiums = new Map();

    teams.forEach(team => {
      const stadiumName = team.stadium.name;
      // Only add if we haven't seen this stadium before
      if (!uniqueStadiums.has(stadiumName)) {
        uniqueStadiums.set(stadiumName, {
          _id: team._id,
          stadiumName: stadiumName,
          teamName: team.teamName,
          location: team.stadium.location,
          seatingCapacity: team.stadium.seatingCapacity,
          yearOpened: team.stadium.yearOpened,
          roofType: team.stadium.roofType,
          surfaceType: team.stadium.surfaceType
        });
      } else {
        // If stadium already exists, add team name to show it's shared
        const existing = uniqueStadiums.get(stadiumName);
        if (!existing.teams) {
          existing.teams = [existing.teamName];
        }
        existing.teams.push(team.teamName);
        existing.teamName = existing.teams.join(', ');
      }
    });

    // Convert map to array and sort by stadium name
    const stadiumList = Array.from(uniqueStadiums.values())
      .sort((a, b) => a.stadiumName.localeCompare(b.stadiumName));

    res.status(200).json({
      success: true,
      count: stadiumList.length, 
      totalTeams: teams.length,  
      data: stadiumList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all stadiums',
      error: error.message
    });
  }
};

const createStadium = async (req, res) => {
    try {
        const stadiums = await Team.stadium.create(req.body);

        res.status(201).json({
            success: true,
            data: stadiums
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating stadium',
            error: error.message
        });
    }
};

const updateStadium = async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findByIdAndUpdate(
            id,
            { stadium: req.body }, 
            { new: true, runValidators: true }
        );

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: team._id,
                teamName: team.teamName,
                stadiumName: team.stadium.name,
                location: team.stadium.location,
                seatingCapacity: team.stadium.seatingCapacity,
                surfaceType: team.stadium.surfaceType,
                roofType: team.stadium.roofType,
                yearOpened: team.stadium.yearOpened
            }
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(400).json({
            success: false,
            message: 'Error updating stadium',
            error: error.message
        });
    }
};

const deleteStadium = async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findOneAndUpdate(
            { _id: id },
            { $unset: { stadium: "" } },
            { new: true }
        );
            
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Stadium deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting stadium',
            error: error.message
        });
    }
}



module.exports = {
    getAllStadiums,
    getStadiumsByRoofType,
    createStadium,
    updateStadium,
    deleteStadium
}