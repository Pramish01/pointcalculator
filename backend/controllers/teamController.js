import { supabase } from '../config/db.js';

export const createTeam = async (req, res) => {
  try {
    const { fullName, tag, logoUrl, players } = req.body;

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert([
        {
          full_name: fullName,
          tag,
          logo_url: logoUrl || '',
          creator_id: req.user.id
        }
      ])
      .select()
      .single();

    if (teamError) {
      throw teamError;
    }

    // Create players if provided
    let formattedPlayers = [];
    if (players && players.length > 0) {
      const playersData = players.map(player => ({
        team_id: team.id,
        name: player.name,
        player_id: player.playerId,
        photo: player.photo || ''
      }));

      const { data: createdPlayers, error: playersError } = await supabase
        .from('players')
        .insert(playersData)
        .select();

      if (playersError) {
        throw playersError;
      }

      formattedPlayers = createdPlayers.map(p => ({
        _id: p.id,
        name: p.name,
        playerId: p.player_id,
        photo: p.photo
      }));
    }

    // Map to match frontend expectations
    const formattedTeam = {
      _id: team.id,
      fullName: team.full_name,
      tag: team.tag,
      logoUrl: team.logo_url,
      players: formattedPlayers,
      creator: team.creator_id,
      createdAt: team.created_at,
      updatedAt: team.updated_at
    };

    res.status(201).json(formattedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    // Get teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .eq('creator_id', req.user.id)
      .order('created_at', { ascending: false });

    if (teamsError) {
      throw teamsError;
    }

    // Get all players for these teams
    const teamIds = teams.map(t => t.id);
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .in('team_id', teamIds);

    if (playersError) {
      throw playersError;
    }

    // Group players by team_id
    const playersByTeam = players.reduce((acc, player) => {
      if (!acc[player.team_id]) {
        acc[player.team_id] = [];
      }
      acc[player.team_id].push({
        _id: player.id,
        name: player.name,
        playerId: player.player_id,
        photo: player.photo
      });
      return acc;
    }, {});

    // Map to match frontend expectations
    const formattedTeams = teams.map(team => ({
      _id: team.id,
      fullName: team.full_name,
      tag: team.tag,
      logoUrl: team.logo_url,
      players: playersByTeam[team.id] || [],
      creator: team.creator_id,
      createdAt: team.created_at,
      updatedAt: team.updated_at
    }));

    res.json(formattedTeams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchTeams = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    let query = supabase
      .from('teams')
      .select('*')
      .eq('creator_id', req.user.id);

    if (keyword) {
      query = query.or(`full_name.ilike.%${keyword}%,tag.ilike.%${keyword}%`);
    }

    const { data: teams, error: teamsError } = await query;

    if (teamsError) {
      throw teamsError;
    }

    // Get all players for these teams
    if (teams.length > 0) {
      const teamIds = teams.map(t => t.id);
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .in('team_id', teamIds);

      if (playersError) {
        throw playersError;
      }

      // Group players by team_id
      const playersByTeam = players.reduce((acc, player) => {
        if (!acc[player.team_id]) {
          acc[player.team_id] = [];
        }
        acc[player.team_id].push({
          _id: player.id,
          name: player.name,
          playerId: player.player_id,
          photo: player.photo
        });
        return acc;
      }, {});

      // Map to match frontend expectations
      const formattedTeams = teams.map(team => ({
        _id: team.id,
        fullName: team.full_name,
        tag: team.tag,
        logoUrl: team.logo_url,
        players: playersByTeam[team.id] || [],
        creator: team.creator_id,
        createdAt: team.created_at,
        updatedAt: team.updated_at
      }));

      res.json(formattedTeams);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (teamError) {
      if (teamError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Team not found' });
      }
      throw teamError;
    }

    if (team.creator_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Get players for this team
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', team.id);

    if (playersError) {
      throw playersError;
    }

    const formattedPlayers = players.map(p => ({
      _id: p.id,
      name: p.name,
      playerId: p.player_id,
      photo: p.photo
    }));

    // Map to match frontend expectations
    const formattedTeam = {
      _id: team.id,
      fullName: team.full_name,
      tag: team.tag,
      logoUrl: team.logo_url,
      players: formattedPlayers,
      creator: team.creator_id,
      createdAt: team.created_at,
      updatedAt: team.updated_at
    };

    res.json(formattedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    // First check if team exists and user owns it
    const { data: existingTeam, error: fetchError } = await supabase
      .from('teams')
      .select('creator_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Team not found' });
      }
      throw fetchError;
    }

    if (existingTeam.creator_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Build update object for team
    const updateData = {};
    if (req.body.fullName !== undefined) updateData.full_name = req.body.fullName;
    if (req.body.tag !== undefined) updateData.tag = req.body.tag;
    if (req.body.logoUrl !== undefined) updateData.logo_url = req.body.logoUrl;

    // Update team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (teamError) {
      throw teamError;
    }

    // Handle players update if provided
    if (req.body.players !== undefined) {
      // Delete existing players
      const { error: deleteError } = await supabase
        .from('players')
        .delete()
        .eq('team_id', req.params.id);

      if (deleteError) {
        throw deleteError;
      }

      // Insert new players
      if (req.body.players.length > 0) {
        const playersData = req.body.players.map(player => ({
          team_id: req.params.id,
          name: player.name,
          player_id: player.playerId,
          photo: player.photo || ''
        }));

        const { error: playersError } = await supabase
          .from('players')
          .insert(playersData);

        if (playersError) {
          throw playersError;
        }
      }
    }

    // Get updated players
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', team.id);

    if (playersError) {
      throw playersError;
    }

    const formattedPlayers = players.map(p => ({
      _id: p.id,
      name: p.name,
      playerId: p.player_id,
      photo: p.photo
    }));

    // Map to match frontend expectations
    const formattedTeam = {
      _id: team.id,
      fullName: team.full_name,
      tag: team.tag,
      logoUrl: team.logo_url,
      players: formattedPlayers,
      creator: team.creator_id,
      createdAt: team.created_at,
      updatedAt: team.updated_at
    };

    res.json(formattedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    // First check if team exists and user owns it
    const { data: existingTeam, error: fetchError } = await supabase
      .from('teams')
      .select('creator_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Team not found' });
      }
      throw fetchError;
    }

    if (existingTeam.creator_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete team (players will be cascade deleted)
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      throw error;
    }

    res.json({ message: 'Team removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
