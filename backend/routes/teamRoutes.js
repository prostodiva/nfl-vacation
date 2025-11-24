const express = require('express');
const {
  getAllTeams,
  getTeamByName,
  getTeamsByConference,
  getTeamsByStadiums,
  getAllTeamsByConference,
  getTeamsByDivision,
  createTeam,
  updateTeam,
  deleteTeam,
  getStadiumsByRoofType,
  getAllStadiums
} = require('../controllers/teamService');

const router = express.Router();

// GET /api/teams - Get all teams
// http://localhost:3001/api/teams
router.get('/', getAllTeams);

// GET /api/teams/stadiums - Get all teams sorted by stadium name
router.get('/stadiums', getTeamsByStadiums);

// GET /api/teams/conference-sorted - Get all teams sorted by conference (AFC first)
router.get('/conference-sorted', getAllTeamsByConference);

// GET /api/teams/conference/:conference - Get teams by conference (afc or nfc)
// http://localhost:3001/api/teams/conference/nfc
router.get('/conference/:conference', getTeamsByConference);

// GET /api/teams/division/:division - Get teams by division
// http://localhost:3001/api/teams/division/NFC%20West
router.get('/division/:division', getTeamsByDivision);

router.get('/roof',  getStadiumsByRoofType)

router.get('/all-stadiums', getAllStadiums);

// GET /api/teams/:teamName - Get single team by name
// http://localhost:3001/api/teams/Arizona%20Cardinals
router.get('/:teamName', getTeamByName);

// POST /api/teams - Create new team  - need to add: (Admin only)
// http://localhost:3001/api/teams
router.post('/', createTeam);

// PUT /api/teams/:teamName - Update team (Admin only)
// http://localhost:3001/api/teams/68f669335adf42c05ae7467d
router.put('/:id', updateTeam);

// DELETE /api/teams/:id - Delete team (Admin only)
// http://localhost:3001/api/teams/68f6671e2f7b55b427ea60dd
router.delete('/:id', deleteTeam);

module.exports = router;