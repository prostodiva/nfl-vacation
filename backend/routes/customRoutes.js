const express = require('express');
const {
    calculateCustomRoute
} = require('../controllers/customRouteService');

const router = express.Router();

router.post('/custom-route', calculateCustomRoute);

module.exports = router;

