import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Briefcase, LogOut, UserCheck } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'badge badge-admin';
      case 'RECRUITER':
        return 'badge badge-recruiter';
      default:
        return 'badge badge-seeker';
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Briefcase size={22} className="brand-symbol" />
          </div>
          <div className="brand-text">
            <span className="brand-name">TalentPulse</span>
            <span className="brand-tagline">Enterprise Talent Portal</span>
          </div>
        </Link>

        <div className="header-actions">
          {isAuthenticated && user ? (
            <div className="user-nav">
              <span className={getRoleBadgeClass(user.role)}>
                <UserCheck size={14} style={{ marginRight: 4 }} />
                {user.role ? user.role.replace('_', ' ') : 'USER'}
              </span>
              <span className="user-email">{user.email}</span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-nav">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

