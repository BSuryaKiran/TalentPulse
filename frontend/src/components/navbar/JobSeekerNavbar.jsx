import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import { Briefcase, LogOut, Menu, UserCheck, Search } from 'lucide-react';

const JobSeekerNavbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="jobseeker-navbar">
      <div className="navbar-left">
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle-btn"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <Link to="/job-seeker" className="brand-logo">
          <div className="brand-icon">
            <Briefcase size={22} className="brand-symbol" />
          </div>
          <div className="brand-text">
            <span className="brand-name">TalentPulse</span>
            <span className="brand-tagline">Job Seeker Workspace</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/jobs" className="nav-quick-search" title="Search Jobs">
          <Search size={16} />
          <span className="search-placeholder-text">Browse Jobs...</span>
        </Link>

        {user && (
          <div className="user-profile-badge">
            <span className="badge badge-seeker">
              <UserCheck size={14} style={{ marginRight: 4 }} />
              JOB SEEKER
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

export default JobSeekerNavbar;
