const express = require('express');
const router = express.Router();
const {
  addScoringRecord,
  getScoringRecords,
  deleteScoringRecord,
} = require('../controllers/scoringController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addScoringRecord);

router.get('/', authMiddleware, getScoringRecords);

router.delete('/:id', authMiddleware, deleteScoringRecord);

module.exports = router;
