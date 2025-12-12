import '../styles/EventCard.css';

const EventCard = ({ event, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
    return <span className="event-status">{statusText}</span>;
  };

  return (
    <div className="event-card">
      {getStatusBadge(event.status)}
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
