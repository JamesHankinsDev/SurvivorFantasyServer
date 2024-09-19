const User = require('../models/User');
const Scoring = require('../models/Scoring');
const Team = require('../models/FantasyTeam');
const { scoringLogic } = require('../utils/scoringLogic');

exports.addScoringRecord = async (req, res) => {
  console.log('In scoring controller');
  console.log({ scoringLogic });
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

    const fantasyTeams = await Team.find({ castaways: castawayId });

    // add points to team totals
    fantasyTeams.forEach(async (team) => {
      team.totalPoints += points;
      await team.save();
    });

    return res.status(200).json(savedScoring);
  } catch (err) {
    console.error({ err });
    return res.status(500).json({ message: 'Could not save scoring' });
  }
};

exports.getScoringRecords = async (req, res) => {
  try {
    const scoringEvents = await Scoring.find();
    console.log(scoringEvents);
    res.status(200).json(scoringEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching scoring' });
  }
};

exports.deleteScoringRecord = async (req, res) => {
  console.log('In method!');
  try {
    const { id } = req.params;
    await Scoring.findByIdAndDelete(id);
    res.status(200).json({ message: 'Scoring Record Deleted' });
  } catch (err) {
    console.error({ deleting: err });
    res.status(500).json({ message: 'Error deleting Scoring' });
  }
};
