import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import { Briefcase, LogOut, Menu, Building2, PlusCircle } from 'lucide-react';

const RecruiterNavbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="recruiter-navbar">
      <div className="navbar-left">
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle-btn"
          aria-label="Toggle Recruiter Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <Link to="/recruiter/dashboard" className="brand-logo">
          <div className="brand-icon recruiter-brand-icon">
            <Briefcase size={22} className="brand-symbol" />
          </div>
          <div className="brand-text">
            <span className="brand-name">TalentPulse</span>
            <span className="brand-tagline recruiter-tagline">Recruiter Portal</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        <Link
          to="/recruiter/jobs"
          className="btn btn-primary btn-sm quick-post-btn"
          title="Post a New Requisition"
        >
          <PlusCircle size={16} />
          <span className="btn-text">Post Job</span>
        </Link>

        {user && (
          <div className="user-profile-badge">
            <span className="badge badge-recruiter">
              <Building2 size={13} style={{ marginRight: 4 }} />
              RECRUITER
            </span>
            <span className="user-name-display">{user.name || user.email}</span>
          </div>
        )}

        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm logout-btn"
          title="Sign Out"
        >
          <LogOut size={16} />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default RecruiterNavbar;
