import { supabase } from '../config/db.js';

export const createEvent = async (req, res) => {
  try {
    const { name, logoUrl, date, primaryColor, secondaryColor } = req.body;

    const { data: event, error } = await supabase
      .from('events')
      .insert([
        {
          name,
          logo_url: logoUrl || '',
          date,
          primary_color: primaryColor || '#0001',
          secondary_color: secondaryColor || '#1111',
          creator_id: req.user.id
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Map to match frontend expectations
    const formattedEvent = {
      _id: event.id,
      name: event.name,
      logoUrl: event.logo_url,
      date: event.date,
      primaryColor: event.primary_color,
      secondaryColor: event.secondary_color,
      creator: event.creator_id,
      status: event.status,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    };

    res.status(201).json(formattedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('creator_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Map to match frontend expectations
    const formattedEvents = events.map(event => ({
      _id: event.id,
      name: event.name,
      logoUrl: event.logo_url,
      date: event.date,
      primaryColor: event.primary_color,
      secondaryColor: event.secondary_color,
      creator: event.creator_id,
      status: event.status,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    }));

    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Event not found' });
      }
      throw error;
    }

    if (event.creator_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Map to match frontend expectations
    const formattedEvent = {
      _id: event.id,
      name: event.name,
      logoUrl: event.logo_url,
      date: event.date,
      primaryColor: event.primary_color,
      secondaryColor: event.secondary_color,
      creator: event.creator_id,
      status: event.status,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    };

    res.json(formattedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    // First check if event exists and user owns it
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('creator_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Event not found' });
      }
      throw fetchError;
    }

    if (existingEvent.creator_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Build update object
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.logoUrl !== undefined) updateData.logo_url = req.body.logoUrl;
    if (req.body.date !== undefined) updateData.date = req.body.date;
    if (req.body.primaryColor !== undefined) updateData.primary_color = req.body.primaryColor;
    if (req.body.secondaryColor !== undefined) updateData.secondary_color = req.body.secondaryColor;
    if (req.body.status !== undefined) updateData.status = req.body.status;

    const { data: event, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Map to match frontend expectations
    const formattedEvent = {
      _id: event.id,
      name: event.name,
      logoUrl: event.logo_url,
      date: event.date,
      primaryColor: event.primary_color,
      secondaryColor: event.secondary_color,
      creator: event.creator_id,
      status: event.status,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    };

    res.json(formattedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    // First check if event exists and user owns it
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('creator_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Event not found' });
      }
      throw fetchError;
    }

    if (existingEvent.creator_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      throw error;
    }

    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
