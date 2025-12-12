import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await eventAPI.getAll();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(id);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const ongoingEvents = events.filter(e => e.status === 'ongoing');

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Background Animation */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Header */}
      <header className="home-header">
        <div className="header-left">
          <div className="logo">E</div>
          <h2>{user?.name || 'EventHub'}</h2>
        </div>
        <div className="header-right">
          <span>User ID: {user?._id?.substring(0, 8)}...</span>
          <Link to="/profile" className="btn-profile">Profile</Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Action Buttons */}
        <div className="home-actions">
          <Link to="/teams" className="btn-action">Team Create</Link>
          <button onClick={handleCreateEvent} className="btn-action">New Event</button>
        </div>

        {/* Event Dashboard */}
        <div className="event-dashboard">
          <h3>Event Dashboard</h3>
          <p>Access your event messages and manage your upcoming activities</p>

          {/* Upcoming Events */}
          <div className="event-section">
            <h4>Upcoming Events</h4>
            <div className="event-list">
              {upcomingEvents.length === 0 ? (
                <p>No upcoming events</p>
              ) : (
                upcomingEvents.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))
              )}
            </div>
          </div>

          {/* Ongoing Events */}
          <div className="event-section">
            <h4>Ongoing Events</h4>
            <div className="event-list">
              {ongoingEvents.length === 0 ? (
                <p>No ongoing events</p>
              ) : (
                ongoingEvents.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default Home;
