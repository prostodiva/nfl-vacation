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
          stadiumName: team.stadium?.name || 'N/A' // Safe access with fallback
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



module.exports = {
    getAllSouvenirs,
    // createSouvenir,
    // updateSouvenir,
    // deleteSouvenir
}