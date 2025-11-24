const express = require('express');
const {
  getStadiumsByRoofType,
  getAllStadiums,
  createStadium,
  updateStadium,
  deleteStadium
} = require('../controllers/stadiumService');

const router = express.Router();

router.get('/roof',  getStadiumsByRoofType)

router.get('/all-stadiums', getAllStadiums);

router.post('/', createStadium);

router.put('/:id', updateStadium);

router.delete('/:id', deleteStadium);

module.exports = router;