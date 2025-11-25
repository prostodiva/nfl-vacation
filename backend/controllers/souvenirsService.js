const Team = require('../models/Team');

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
        await team.save();

        res.status(201).json({
            success: true,
            data: souvenir 
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating souvenir',
            error: error.message
        });
    }
}; 

const updateSouvenir = async (req, res) => {
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

        // Get the souvenir subdocument
        const souvenir = team.souvenirs.id(id);
        
        // Update the souvenir fields
        Object.assign(souvenir, req.body);

        // Save the team
        await team.save();

        res.status(200).json({
            success: true,
            data: souvenir
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating souvenir',
            error: error.message
        });
    }
};

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
        await team.save();

        res.status(200).json({
            success: true,
            message: 'Souvenir deleted successfully'
        });
    } catch (error) {
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