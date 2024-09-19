const Scoring = require('../models/Scoring');
const Castaway = require('../models/Castaway');
const Team = require('../models/FantasyTeam');

exports.setScoreForCastaway = async (req, res) => {
  try {
    const { points, week } = req.body;
    const castawayId = req.params.castawayId;

    const newScore = new Scoring({ castawayId, points, week });
    await newScore.save();

    const teams = await Team.find({ castaways: castawayId });
    teams.forEach(async (team) => {
      team.totalPoints += points;
      await team.save();
    });

    res.status(200).json({ message: 'Score updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating score' });
  }
};

exports.createCastaway = async (req, res) => {
  const { name, tribe, season, imageUrl } = req.body;
  try {
    const newCastaway = new Castaway({ name, tribe, season, imageUrl });
    const savedCastaway = await newCastaway.save();
    res.status(201).json(savedCastaway);
  } catch (err) {
    res.status(500).json({ message: 'Error creating castaway' });
  }
};

exports.updateCastaway = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tribe, status, season } = req.body;
    const updatedCastaway = await Castaway.findByIdAndUpdate(id, {
      name,
      tribe,
      status,
      season,
    });
    if (!updatedCastaway)
      return res.status(404).json({ message: 'Castaway not found' });
    res.status(200).json(updatedCastaway);
  } catch (err) {
    res.status(500).json({ message: 'Error updating castaway' });
  }
};
exports.deleteCastaway = async (req, res) => {
  try {
    const { id } = req.params;
    await Castaway.findByIdAndDelete(id);
    res.status(200).json({ message: 'Castaway deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting Castaway' });
  }
};
exports.getAllCastaways = async (req, res) => {
  try {
    const castaways = await Castaway.find();
    res.status(200).json(castaways);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching castaways' });
  }
};
