const express = require('express');
const {
  getStadiumsByRoofType,
  getAllStadiums
} = require('../controllers/stadiumService');

const router = express.Router();

router.get('/roof',  getStadiumsByRoofType)

router.get('/all-stadiums', getAllStadiums);

module.exports = router;