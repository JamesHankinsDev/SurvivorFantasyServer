const Team = require('../models/FantasyTeam');
const Castaway = require('../models/Castaway');

exports.createTeam = async (req, res) => {
  try {
    const newTeam = new Team({
      userId: req.user.id,
      castaways: [],
    });
    const savedTeam = await newTeam.save();
    return res.status(200).json(savedTeam);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating team' });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findOneAndDelete({ userId: req.user.id });
    return res.status(200).json({ message: 'Team deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error in deleting!' });
  }
};

exports.addCastawayToTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ userId: req.user.id });

    if (!team) return res.status(404).json({ message: 'Team not found!' });

    if (team.castaways.length >= 5) {
      return res
        .status(400)
        .json({ message: 'You can only draft 5 castaways!' });
    }

    if (team.castaways.includes(req.params.castawayId)) {
      return res
        .status(400)
        .json({ message: 'Castaway is already in your tribe' });
    }

    const castaway = await Castaway.findById(req.params.castawayId);

    if (!castaway || castaway.status === 'eliminated') {
      return res.status(400).json({ message: 'Invalid Contestant' });
    }

    team.castaways.push(castaway._id);

    await team.save();

    const retTeam = await Team.findOne({ userId: req.user.id })
      .populate('castaways')
      .populate({
        path: 'castaways',
        populate: {
          path: 'scoringEventIds',
          model: 'Scoring',
        },
      });

    return res.status(200).json(retTeam);
  } catch (err) {
    console.error('could not add castaway to team: ', err);
    return res
      .status(500)
      .json({ message: 'Error adding contestant to team!' });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('castaways')
      .populate('userId')
      .populate({
        path: 'castaways',
        populate: {
          path: 'scoringEventIds',
          model: 'Scoring',
        },
      })
      .select('-password');
    return res.status(200).json(await teams);
  } catch (err) {
    console.error({ getAllTeams: err });
    return res.status(500).json({ message: 'Error fetching teams.' });
  }
};

exports.getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ userId: req.user.id })
      .populate('castaways')
      .populate({
        path: 'castaways',
        populate: {
          path: 'scoringEventIds',
          model: 'Scoring',
        },
      });
    // .populate('fantasyTribes.castaways');
    if (!team) return res.status(200).json(null);

    return res.status(200).json(team);
  } catch (err) {
    console.error({ getMyTeam: err });
    return res.status(500).json({ message: 'Error finding your team.' });
  }
};

exports.dropCastawayFromTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ userId: req.user.id });

    if (!team) return res.status(404).json({ message: 'Team not found!' });

    if (team.castaways.length === 0) {
      return res.status(400).json({ message: 'No castaways on team.' });
    }

    const targetId = req.params.castawayId;

    const castawayIndex = team.castaways.indexOf(targetId);

    if (castawayIndex === -1) {
      return res.status(400).json({ message: 'Castaway not in your tribe' });
    }

    team.castaways.splice(castawayIndex, 1);

    await team.save();

    const retTeam = await Team.findOne({ userId: req.user.id })
      .populate('castaways')
      .populate({
        path: 'castaways',
        populate: {
          path: 'scoringEventIds',
          model: 'Scoring',
        },
      });

    return res.status(200).json(retTeam);
  } catch (err) {
    console.error('Error removing castaway', { err });
    return res
      .status(500)
      .json({ message: 'Error removing contestant to team!' });
  }
};

exports.freezeCastawayTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ userId: req.user.id });
    if (!team) return res.status(404).json({ message: 'Team not found!' });

    const week = req.body.targetWeek;
    const castaways = team.castaways;

    team.fantasyTribes.push({ week, castaways });

    team.save();

    return res.status(200).json(
      (await team.populate('castaways'))
        .populate('fantasyTribes.castaways')
        .populate({
          path: 'castaways',
          populate: {
            path: 'scoringEventIds',
            model: 'Scoring',
          },
        })
    );
  } catch (err) {
    console.error({ freeze: err });
  }
};
