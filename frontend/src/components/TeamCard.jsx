import '../styles/TeamCard.css';

const TeamCard = ({ team, onEdit, onDelete }) => {
  return (
    <div className="team-card">
      {team.logoUrl && (
        <img src={team.logoUrl} alt={team.fullName} className="team-logo" />
      )}
      <h5>{team.fullName}</h5>
      <p className="team-tag">{team.tag}</p>
      <p className="team-players">{team.players.length} Players</p>
      <div className="team-actions">
        <button onClick={() => onEdit(team)} className="btn-edit">Edit</button>
        <button onClick={() => onDelete(team._id)} className="btn-delete">Delete</button>
      </div>
    </div>
  );
};

export default TeamCard;
