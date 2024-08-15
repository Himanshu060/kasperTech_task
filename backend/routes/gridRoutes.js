const express = require('express');
const { createGrid, markNumber, getGrids } = require('../Controllers/gridController');
const router = express.Router();

router.post('/create', createGrid);
router.put('/mark', markNumber);
router.get('/grids',getGrids);

module.exports = router;
