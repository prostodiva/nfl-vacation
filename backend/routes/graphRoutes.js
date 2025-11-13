const express = require('express');
const {
  runBFS,
  runDFS,
  runDijkstra
} = require('../controllers/graphService');

const router = express.Router();

router.get('/dfs', runDFS);
router.get('/bfs', runBFS);
router.get('/dijkstra', runDijkstra);

module.exports = router;

