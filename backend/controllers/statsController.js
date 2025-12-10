import Event from '../models/Event.js';
import Team from '../models/Team.js';

export const getUserStats = async (req, res) => {
  try {
    const totalTeamsCreated = await Team.countDocuments({ creator: req.user._id });
    const totalEventsHosted = await Event.countDocuments({ creator: req.user._id });

    res.json({
      totalTeamsCreated,
      totalEventsHosted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
