/**
 * @fileoverview Stadium service controller - Handles all stadium-related API endpoints
 * @module stadiumService
 */

const Team = require('../models/Team');

/**
 * Get stadiums by roof type
 * Returns unique stadiums filtered by roof type (if two teams share a stadium, count once)
 * 
 * @route GET /api/stadiums/roof
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.roofType - Roof type: 'Open', 'Fixed', or 'Retractable'
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, count, and stadium data
 * @example
 * // Request: GET /api/stadiums/roof?roofType=Open
 * // Response:
 * {
 *   success: true,
 *   count: 15,
 *   totalTeams: 20,
 *   roofType: 'Open',
 *   data: [/* array of unique stadiums *\/]
 * }
 */
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

/**
 * Get all unique stadiums
 * Returns all unique stadiums from all teams (if two teams share a stadium, count once)
 * 
 * @route GET /api/stadiums/all-stadiums
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, count, and stadium data
 * @example
 * // Request: GET /api/stadiums/all-stadiums
 * // Response:
 * {
 *   success: true,
 *   count: 30,
 *   data: [/* array of unique stadiums *\/]
 * }
 */
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

/**
 * Create new stadium
 * Creates a new stadium (Admin only)
 * 
 * @route POST /api/stadiums
 * @access Private (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} req.body - Stadium data to create
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and created stadium data
 */
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

/**
 * Update stadium
 * Updates an existing stadium by team ID (Admin only)
 * Updates the stadium information for the team
 * 
 * @route PUT /api/stadiums/:id
 * @access Private (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Team ID whose stadium to update
 * @param {Object} req.body - Updated stadium data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and updated stadium data
 */
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

/**
 * Delete stadium
 * Deletes a stadium by removing it from the team (Admin only)
 * Uses $unset to remove the stadium field from the team document
 * 
 * @route DELETE /api/stadiums/:id
 * @access Private (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Team ID whose stadium to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and message
 */
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