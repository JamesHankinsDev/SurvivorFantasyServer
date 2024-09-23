const User = require('../models/User');
const Scoring = require('../models/Scoring');
const Castaway = require('../models/Castaway');
const Team = require('../models/FantasyTeam');
const { scoringLogic } = require('../utils/scoringLogic');

exports.addScoringRecord = async (req, res) => {
  try {
    const { castawayId, scoringEvent, week } = req.body;

    const points = scoringLogic(req.body.scoringEvent);
    const newScoringEvent = new Scoring({
      castawayId: castawayId,
      scoringEvent: scoringEvent,
      points: points,
      week: week,
    });
    const savedScoring = await newScoringEvent.save();

    const castaway = await Castaway.findById(castawayId);

    castaway.scoringEventIds.push(savedScoring._id);

    castaway.save();

    return res.status(200).json(savedScoring);
  } catch (err) {
    console.error({ err });
    return res.status(500).json({ message: 'Could not save scoring' });
  }
};

exports.getScoringRecords = async (req, res) => {
  try {
    const scoringEvents = await Scoring.find().populate('castawayId');
    res.status(200).json(scoringEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching scoring' });
  }
};

exports.deleteScoringRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const scoreToDelete = await Scoring.findById(id);

    const castaway = await Castaway.findById(scoreToDelete.castawayId);

    const index = castaway.scoringEventIds.indexOf(id);

    castaway.scoringEventIds.splice(index, 1);

    castaway.save();

    await Scoring.findByIdAndDelete(id);
    res.status(200).json({ message: 'Scoring Record Deleted' });
  } catch (err) {
    console.error({ deleting: err });
    res.status(500).json({ message: 'Error deleting Scoring' });
  }
};
