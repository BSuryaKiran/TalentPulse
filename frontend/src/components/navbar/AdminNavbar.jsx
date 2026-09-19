import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Briefcase, LogOut, Menu, Shield, Server } from 'lucide-react';

const AdminNavbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle-btn"
          aria-label="Toggle Admin Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <Link to="/admin/dashboard" className="brand-logo">
          <div className="brand-icon admin-brand-icon">
            <Briefcase size={22} className="brand-symbol" />
          </div>
          <div className="brand-text">
            <span className="brand-name">TalentPulse</span>
            <span className="brand-tagline admin-tagline">Administration Console</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        <Link
          to="/admin/system"
          className="btn btn-outline btn-sm nav-system-btn"
          title="Microservice Topology & Gateway Status"
        >
          <Server size={14} />
          <span className="hide-mobile">System Overview</span>
        </Link>

        {user && (
          <div className="user-profile-badge">
            <span className="badge badge-admin">
              <Shield size={13} style={{ marginRight: 4 }} />
              ADMIN
            </span>
            <span className="user-name-display">{user.name || user.email}</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm logout-btn"
          title="Sign Out of Admin Console"
        >
          <LogOut size={16} />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
