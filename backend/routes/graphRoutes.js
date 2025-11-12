const express = require('express');
const {
  runBFS,
  runDFS,
  calculateCustomRoute
} = require('../controllers/graphService');

const router = express.Router();

router.get('/dfs', runDFS);
router.get('/bfs', runBFS);

module.exports = router;

