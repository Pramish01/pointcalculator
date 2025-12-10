import Team from '../models/Team.js';

export const createTeam = async (req, res) => {
  try {
    const { fullName, tag, logoUrl, players } = req.body;

    const team = await Team.create({
      fullName,
      tag,
      logoUrl,
      players,
      creator: req.user._id
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ creator: req.user._id }).sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchTeams = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          creator: req.user._id,
          $or: [
            { fullName: { $regex: req.query.keyword, $options: 'i' } },
            { tag: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : { creator: req.user._id };

    const teams = await Team.find(keyword);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (team) {
      if (team.creator.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(team);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (team) {
      if (team.creator.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      team.fullName = req.body.fullName || team.fullName;
      team.tag = req.body.tag || team.tag;
      team.logoUrl = req.body.logoUrl || team.logoUrl;
      team.players = req.body.players || team.players;

      const updatedTeam = await team.save();
      res.json(updatedTeam);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (team) {
      if (team.creator.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await team.deleteOne();
      res.json({ message: 'Team removed' });
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
