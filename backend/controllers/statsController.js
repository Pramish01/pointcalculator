import { supabase } from '../config/db.js';

export const getUserStats = async (req, res) => {
  try {
    // Count teams created by user
    const { count: totalTeamsCreated, error: teamsError } = await supabase
      .from('teams')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', req.user.id);

    if (teamsError) {
      throw teamsError;
    }

    // Count events hosted by user
    const { count: totalEventsHosted, error: eventsError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', req.user.id);

    if (eventsError) {
      throw eventsError;
    }

    res.json({
      totalTeamsCreated: totalTeamsCreated || 0,
      totalEventsHosted: totalEventsHosted || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
