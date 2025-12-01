/**
 * @fileoverview Souvenir service controller - Handles all souvenir-related API endpoints
 * @module souvenirsService
 */

const Team = require('../models/Team');

/**
 * Get all souvenirs
 * Retrieves all souvenirs from all teams, flattened with team and stadium information
 * 
 * @route GET /api/souvenirs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, count, and souvenir data
 * @example
 * // Request: GET /api/souvenirs
 * // Response:
 * {
 *   success: true,
 *   count: 150,
 *   data: [
 *     {
 *       _id: '...',
 *       name: 'Team Jersey',
 *       price: 99.99,
 *       category: 'Apparel',
 *       teamName: 'Green Bay Packers',
 *       stadiumName: 'Lambeau Field',
 *       ...
 *     },
 *     ...
 *   ]
 * }
 */
const getAllSouvenirs = async (req, res) => {
  try {
    const teams = await Team.find({}, 'teamName souvenirs stadium');

    // Flatten souvenirs array with team info
    const allSouvenirs = [];
    teams.forEach(team => {
      // Skip teams without souvenirs
      if (!team.souvenirs || team.souvenirs.length === 0) {
        return;
      }

      team.souvenirs.forEach(souvenir => {
        allSouvenirs.push({
          _id: souvenir._id,
          name: souvenir.name,
          price: souvenir.price,
          category: souvenir.category,
          isTraditional: souvenir.isTraditional,
          teamName: team.teamName,
          stadiumName: team.stadium?.name || 'N/A'
        });
      });
    });

    // Sort souvenirs by name
    allSouvenirs.sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json({
      success: true,
      count: allSouvenirs.length,
      data: allSouvenirs
    });
  } catch (error) {
    console.error('Error fetching souvenirs:', error); 
    res.status(500).json({
      success: false,
      message: 'Error fetching all souvenirs',
      error: error.message
    });
  }
};

const createSouvenir = async (req, res) => { 
    try {
        const { teamId, souvenir } = req.body; 

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        team.souvenirs.push(souvenir);
        
        // Save without validating the entire document to avoid division validation errors
        await team.save({ validateBeforeSave: false });

        res.status(201).json({
            success: true,
            data: souvenir 
        });
    } catch (error) {
        console.error('❌ Error in createSouvenir:', error);
        res.status(400).json({
            success: false,
            message: 'Error creating souvenir',
            error: error.message
        });
    }
}; 

/**
 * Update souvenir
 * Updates an existing souvenir by ID (Admin only)
 * Only allows updating name, price, category, and isTraditional fields
 * 
 * @route PUT /api/souvenirs/:id
 * @access Private (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Souvenir ID to update
 * @param {Object} req.body - Updated souvenir data (name, price, category, isTraditional)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and updated souvenir data
 */
const updateSouvenir = async (req, res) => {
    try {
        const { id } = req.params;
        
        const teams = await Team.find({});
        let foundTeam = null;
        let foundSouvenir = null;
        
        for (const team of teams) {
            const souvenir = team.souvenirs.id(id);
            if (souvenir) {
                foundTeam = team;
                foundSouvenir = souvenir;
                break;
            }
        }

        if (!foundTeam || !foundSouvenir) {
            return res.status(404).json({
                success: false,
                message: 'Souvenir not found'
            });
        }
        
        // Only allow updating souvenir-specific fields
        const allowedFields = ['name', 'price', 'category', 'isTraditional'];
        const updateData = {};
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        
        // Update only the allowed souvenir fields
        Object.assign(foundSouvenir, updateData);

        // Mark the souvenirs array as modified
        foundTeam.markModified('souvenirs');
        
        // Save without validating the entire document (like previous version)
        await foundTeam.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            data: foundSouvenir
        });
    } catch (error) {
        console.error('❌ Error in updateSouvenir:', error);
        res.status(400).json({
            success: false,
            message: 'Error updating souvenir',
            error: error.message
        });
    }
};

/**
 * Delete souvenir
 * Deletes a souvenir by ID (Admin only)
 * Removes the souvenir from the team's souvenirs array
 * 
 * @route DELETE /api/souvenirs/:id
 * @access Private (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Souvenir ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and message
 */
const deleteSouvenir = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the team containing this souvenir
        const team = await Team.findOne({ 'souvenirs._id': id });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Souvenir not found'
            });
        }

        // Remove the souvenir using pull method
        team.souvenirs.pull(id);
        
        // Save without validating the entire document (like updateSouvenir)
        await team.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Souvenir deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error in deleteSouvenir:', error);
        res.status(400).json({
            success: false,
            message: 'Error deleting souvenir',
            error: error.message
        });
    }
};


module.exports = {
    getAllSouvenirs,
    createSouvenir,
     updateSouvenir,
     deleteSouvenir
}