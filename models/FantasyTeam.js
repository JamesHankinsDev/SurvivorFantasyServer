const mongoose = require('mongoose');

const fantasyTeamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  castaways: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Castaway' }],
  totalPoints: { type: Number, default: 0 },
  fantasyTribes: [
    {
      week: { type: Number, required: true },
      castaways: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Castaway' }],
    },
  ],
});

fantasyTeamSchema.pre('save', function (next) {
  if (this.castaways.length > 5) {
    throw new Error('Fantasy Tribes can only have 5 castaways');
  }

  next();
});

module.exports = mongoose.model('Fantasy_Tribe', fantasyTeamSchema);
