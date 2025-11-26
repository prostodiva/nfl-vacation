const Team = require('../models/Team');
const express = require('express');
const {
    calculateCustomRoute,
    calculateRecursiveRoute
} = require('../controllers/customRouteService');

const router = express.Router();

router.post('/custom-route', calculateCustomRoute);
router.post('/recursive', calculateRecursiveRoute);

module.exports = router;

