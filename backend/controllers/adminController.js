import { supabase } from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, profile_picture, status, is_admin, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Map to match frontend expectations
    const formattedUsers = users.map(user => ({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profile_picture,
      status: user.status,
      isAdmin: user.is_admin,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }));

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, profile_picture, status, is_admin, created_at, updated_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Map to match frontend expectations
    const formattedUsers = users.map(user => ({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profile_picture,
      status: user.status,
      isAdmin: user.is_admin,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }));

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({ status: 'approved' })
      .eq('id', req.params.id)
      .select('id, name, email, status')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'User not found' });
      }
      throw error;
    }

    res.json({
      message: 'User approved successfully',
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({ status: 'rejected' })
      .eq('id', req.params.id)
      .select('id, name, email, status')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'User not found' });
      }
      throw error;
    }

    res.json({
      message: 'User rejected successfully',
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'User not found' });
      }
      throw error;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
