const mongoose = require('mongoose');

const scoringSchema = new mongoose.Schema({
  castawayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Castaway',
    required: true,
  },
  scoringEvent: {
    type: String,
    enum: [
      'VF',
      'VA',
      'CW',
      'IW',
      'IF',
      'EL',
      'TC',
      'FM',
      'Thrd',
      'Scnd',
      'Frst',
    ],
    required: true,
  },
  points: { type: Number, required: true },
  week: { type: Number, required: true },
});

module.exports = mongoose.model('Scoring', scoringSchema);
