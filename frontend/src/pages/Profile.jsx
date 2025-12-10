import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statsAPI } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTeamsCreated: 0,
    totalEventsHosted: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await statsAPI.getUserStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Link to="/" className="btn-back">Back to Home</Link>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>

      <div className="profile-card">
        <div className="profile-picture">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} />
          ) : (
            <div className="profile-pic-placeholder">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h2>{user?.name}</h2>
        <p className="profile-email">{user?.email}</p>

        <div className="profile-stats">
          <div className="stat-item">
            <h3>{stats.totalTeamsCreated}</h3>
            <p>Total Teams Created</p>
          </div>
          <div className="stat-item">
            <h3>{stats.totalEventsHosted}</h3>
            <p>Total Events Hosted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
