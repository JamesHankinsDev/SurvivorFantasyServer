const mongoose = require('mongoose');

const castawaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  tribe: { type: String, required: true },
  status: { type: String, enum: ['active', 'eliminated'], default: 'active' },
  season: { type: Number, required: true },
  imageUrl: { type: String },
});

module.exports = mongoose.model('Castaway', castawaySchema);
