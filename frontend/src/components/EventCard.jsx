import '../styles/EventCard.css';

const EventCard = ({ event, onEdit, onDelete }) => {
  return (
    <div className="event-card" style={{ borderColor: event.primaryColor }}>
      {event.logoUrl && (
        <img src={event.logoUrl} alt={event.name} className="event-logo" />
      )}
      <h5>{event.name}</h5>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <div className="event-actions">
        <button onClick={() => onEdit(event)} className="btn-edit">Edit</button>
        <button onClick={() => onDelete(event._id)} className="btn-delete">Delete</button>
      </div>
    </div>
  );
};

export default EventCard;
