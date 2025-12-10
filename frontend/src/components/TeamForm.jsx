import { useState, useEffect } from 'react';
import { teamAPI } from '../utils/api';
import '../styles/TeamForm.css';

const TeamForm = ({ team, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    tag: '',
    logoUrl: '',
    players: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (team) {
      setFormData({
        fullName: team.fullName,
        tag: team.tag,
        logoUrl: team.logoUrl || '',
        players: team.players || []
      });
    }
  }, [team]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = {
      ...newPlayers[index],
      [field]: value
    };
    setFormData({
      ...formData,
      players: newPlayers
    });
  };

  const handleAddPlayer = () => {
    setFormData({
      ...formData,
      players: [...formData.players, { name: '', playerId: '', photo: '' }]
    });
  };

  const handleRemovePlayer = (index) => {
    const newPlayers = formData.players.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      players: newPlayers
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (team) {
        await teamAPI.update(team._id, formData);
      } else {
        await teamAPI.create(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-large">
        <h2>{team ? 'Edit Team' : 'Create New Team'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Team Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Team Tag</label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Team Logo URL</label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
            />
          </div>

          <div className="players-section">
            <h3>Players</h3>
            {formData.players.map((player, index) => (
              <div key={index} className="player-form">
                <div className="form-group">
                  <label>Player Name</label>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Player ID</label>
                  <input
                    type="text"
                    value={player.playerId}
                    onChange={(e) => handlePlayerChange(index, 'playerId', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Photo URL</label>
                  <input
                    type="url"
                    value={player.photo}
                    onChange={(e) => handlePlayerChange(index, 'photo', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(index)}
                  className="btn-remove-player"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPlayer}
              className="btn-add-player"
            >
              Add Another Player
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {team ? 'Update Team' : 'Create Team'}
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

export default TeamForm;
