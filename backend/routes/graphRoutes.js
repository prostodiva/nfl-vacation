const express = require('express');
const {
  runBFS,
  runDFS,
  runDijkstra,
  runAStar,
  runKruskal 
} = require('../controllers/graphService');

const router = express.Router();

router.get('/dfs', runDFS);
router.get('/bfs', runBFS);
router.get('/dijkstra', runDijkstra);
router.get('/astar', runAStar);
router.get('/kruskal', runKruskal);

module.exports = router;

