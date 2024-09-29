// TO DEPRECATE AFTER MIGRATION

const express = require('express');
const router = express.Router();
const {
  createCastaway,
  updateCastaway,
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
