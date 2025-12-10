import { useState, useEffect } from 'react';
import { teamAPI } from '../utils/api';
import TeamCard from '../components/TeamCard';
import TeamForm from '../components/TeamForm';
import { Link } from 'react-router-dom';
import '../styles/Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data } = await teamAPI.getAll();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const { data } = await teamAPI.search(value);
        setTeams(data);
      } catch (error) {
        console.error('Error searching teams:', error);
      }
    } else {
      fetchTeams();
    }
  };

  const handleCreateTeam = () => {
    setEditingTeam(null);
    setShowTeamForm(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowTeamForm(true);
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamAPI.delete(id);
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowTeamForm(false);
    setEditingTeam(null);
    fetchTeams();
  };

  return (
    <div className="teams-container">
      <div className="teams-header">
        <Link to="/" className="btn-back">Back to Home</Link>
        <h2>Team Management</h2>
      </div>

      <div className="teams-overview">
        <h3>Team Overview</h3>
        <p>Create and edit your team</p>
      </div>

      <div className="teams-actions">
        <button onClick={handleCreateTeam} className="btn-add-team">Add Team</button>
        <input
          type="text"
          placeholder="Search teams by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="teams-list">
        {teams.length === 0 ? (
          <p>No teams found</p>
        ) : (
          teams.map(team => (
            <TeamCard
              key={team._id}
              team={team}
              onEdit={handleEditTeam}
              onDelete={handleDeleteTeam}
            />
          ))
        )}
      </div>

      {showTeamForm && (
        <TeamForm
          team={editingTeam}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default Teams;
