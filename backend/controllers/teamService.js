/**
 * @fileoverview Team service controller - Handles all team-related API endpoints
 * @module teamService
 */

const Team = require('../models/Team');

/**
 * Get all teams
 * Retrieves all teams from the database, sorted alphabetically by team name
 * 
 * @route GET /api/teams
 * @returns {Object} JSON response with success status, count, and data array
 * @example
 * // Response:
 * {
 *   success: true,
 *   count: 32,
 *   data: [/* array of team objects *\/]
 * }
 */
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

/**
 * Get single team by name
 * Retrieves a specific team by its team name
 * 
 * @route GET /api/teams/name/:teamName
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.teamName - Name of the team to retrieve
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and team data
 * @example
 * // Request: GET /api/teams/name/Green%20Bay%20Packers
 * // Response:
 * {
 *   success: true,
 *   data: { /* team object *\/ }
 * }
 */
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

/**
 * Get teams by conference
 * Retrieves all teams in a specific conference (AFC or NFC)
 * Supports both short form ('afc', 'nfc') and full names
 * 
 * @route GET /api/teams/conference/:conference
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.conference - Conference name ('afc', 'nfc', or full name)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, count, and data array
 */
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

/**
 * Get teams sorted by stadium name
 * Retrieves all teams sorted alphabetically by stadium name
 * 
 * @route GET /api/teams/stadiums
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, count, and data array
 */
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

/**
 * Get all teams sorted by conference
 * Retrieves all teams sorted first by conference (AFC before NFC), then by team name
 * 
 * @route GET /api/teams/by-conference
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, count, and data array
 */
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


/**
 * Get teams by division
 * Retrieves all teams in a specific division
 * 
 * @route GET /api/teams/division/:division
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.division - Division name (e.g., 'AFC East', 'NFC West')
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, count, and data array
 */
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

/**
 * Create new team
 * Creates a new team in the database (Admin only)
 * 
 * @route POST /api/teams
 * @access Private (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} req.body - Team data to create
 * @param {string} req.body.teamName - Team name (required, unique)
 * @param {string} req.body.conference - Conference name (required)
 * @param {string} req.body.division - Division name (required)
 * @param {Object} req.body.stadium - Stadium object (required)
 * @param {Array} req.body.souvenirs - Array of souvenir objects
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and created team data
 */
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

/**
 * Update team
 * Updates an existing team by ID (Admin only)
 * 
 * @route PUT /api/teams/:id
 * @access Private (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Team ID to update
 * @param {Object} req.body - Updated team data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and updated team data
 */
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

/**
 * Delete team
 * Deletes a team by ID (Admin only)
 * Also removes stadium reference from related teams
 * 
 * @route DELETE /api/teams/:id
 * @access Private (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Team ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and message
 */
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



module.exports = {
  getAllTeams,
  getTeamByName,
  getTeamsByConference,
  getTeamsByStadiums,
  getAllTeamsByConference,
  getTeamsByDivision,
  createTeam,
  updateTeam,
  deleteTeam
};