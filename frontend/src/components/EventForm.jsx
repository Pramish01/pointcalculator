import { useState, useEffect } from 'react';
import { eventAPI } from '../utils/api';
import '../styles/EventForm.css';

const EventForm = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    date: '',
    primaryColor: '#0001',
    secondaryColor: '#1111',
    status: 'upcoming'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        logoUrl: event.logoUrl || '',
        date: new Date(event.date).toISOString().split('T')[0],
        primaryColor: event.primaryColor,
        secondaryColor: event.secondaryColor,
        status: event.status
      });
    }
  }, [event]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (event) {
        await eventAPI.update(event._id, formData);
      } else {
        await eventAPI.create(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Event Logo URL</label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Event Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Primary Color</label>
            <input
              type="color"
              name="primaryColor"
              value={formData.primaryColor}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Secondary Color</label>
            <input
              type="color"
              name="secondaryColor"
              value={formData.secondaryColor}
              onChange={handleChange}
            />
          </div>
          {event && (
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {event ? 'Update Event' : 'Create Event'}
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
