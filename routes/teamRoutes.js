const express = require('express');
const router = express.Router();
const {
  addCastawayToTeam,
  dropCastawayFromTeam,
  getAllTeams,
  getMyTeam,
  createTeam,
  deleteTeam,
  freezeCastawayTeam,
} = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createTeam);

router.get('/', authMiddleware, getAllTeams);

router.get('/myTeam', authMiddleware, getMyTeam);

router.post('/add/:castawayId', authMiddleware, addCastawayToTeam);

router.post('/drop/:castawayId', authMiddleware, dropCastawayFromTeam);

router.delete('/delete', authMiddleware, deleteTeam);

router.post('/freeze', authMiddleware, freezeCastawayTeam);

module.exports = router;
