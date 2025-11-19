const Team = require('../models/Team');

// Get all teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({})
      .sort({ teamName: 1 }); // Sort alphabetically
    
    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
      error: error.message
    });
  }
};

// Get single team by name
const getTeamByName = async (req, res) => {
  try {
    const { teamName } = req.params;
    
    const team = await Team.findOne({ teamName: teamName });
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching team',
      error: error.message
    });
  }
};

// Get teams by conference
const getTeamsByConference = async (req, res) => {
  try {
    const { conference } = req.params;
    
    // Convert short form to full name
    const conferenceMap = {
      'afc': 'American Football Conference',
      'nfc': 'National Football Conference'
    };
    
    const fullConference = conferenceMap[conference.toLowerCase()] || conference;

    const teams = await Team.find({ conference: fullConference })
        .sort({ teamName: 1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teams by conference',
      error: error.message
    });
  }
};

//by stadiumName
const getTeamsByStadiums = async (req, res) => {
  try {
    const teams = await Team.find({})
        .sort({ 'stadium.name': 1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teams by stadiums',
      error: error.message
    });
  }
};

// Get all teams sorted by conference (AFC first, then NFC)
const getAllTeamsByConference = async (req, res) => {
  try {
    // Sort by conference (AFC comes before NFC alphabetically), then team name
    const teams = await Team.find({})
        .sort({
          conference: 1,  // AFC before NFC
          teamName: 1     // Then alphabetically by team name
        });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teams by conference',
      error: error.message
    });
  }
};


// Get teams by division
const getTeamsByDivision = async (req, res) => {
  try {
    const { division } = req.params;
    
    const teams = await Team.find({ division: division })
      .sort({ teamName: 1 });
    
    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teams by division',
      error: error.message
    });
  }
};

// Create new team (Admin only)
const createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);
    
    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating team',
      error: error.message
    });
  }
};

// Update team (Admin only)
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    
    const team = await Team.findOneAndUpdate(
      { _id: id },
      req.body,
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
      data: team
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating team',
      error: error.message
    });
  }
};

// Delete team (Admin only)
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    
    const team = await Team.findOneAndDelete({ _id: id });
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting team',
      error: error.message
    });
  }
};

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


module.exports = {
  getAllTeams,
  getTeamByName,
  getTeamsByConference,
  getTeamsByStadiums,
  getAllTeamsByConference,
  getTeamsByDivision,
  getStadiumsByRoofType,
  createTeam,
  updateTeam,
  deleteTeam
};