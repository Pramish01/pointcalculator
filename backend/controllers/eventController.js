import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { name, logoUrl, date, primaryColor, secondaryColor } = req.body;

    const event = await Event.create({
      name,
      logoUrl,
      date,
      primaryColor,
      secondaryColor,
      creator: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      if (event.creator.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      if (event.creator.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      event.name = req.body.name || event.name;
      event.logoUrl = req.body.logoUrl || event.logoUrl;
      event.date = req.body.date || event.date;
      event.primaryColor = req.body.primaryColor || event.primaryColor;
      event.secondaryColor = req.body.secondaryColor || event.secondaryColor;
      event.status = req.body.status || event.status;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      if (event.creator.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
