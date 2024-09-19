const mongoose = require('mongoose');

const scoringSchema = new mongoose.Schema({
  castawayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Castaway',
    required: true,
  },
  points: { type: Number, required: true },
  week: { type: Number, required: true },
});

module.exports = mongoose.model('Scoring', scoringSchema);
