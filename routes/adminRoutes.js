const express = require('express');
const router = express.Router();
const {
  createCastaway,
  updateCastaway,
  setScoreForCastaway,
  deleteCastaway,
  getAllCastaways,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
  '/castaway',
  authMiddleware,
  // roleMiddleware('admin'),
  createCastaway
);

router.put(
  '/castaway/:id',
  authMiddleware,
  // roleMiddleware('admin'),
  updateCastaway
);

router.post(
  '/score/:castawayId',
  authMiddleware,
  // roleMiddleware('admin'),
  setScoreForCastaway
);

router.delete(
  '/castaway/:id',
  authMiddleware,
  // roleMiddleware('admin'),
  deleteCastaway
);

router.get(
  '/castaways',
  authMiddleware,
  // roleMiddleware('admin'),
  getAllCastaways
);

module.exports = router;
