import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import {
  Briefcase, Menu, X, ArrowRight, UserCheck, LogOut,
} from 'lucide-react';

const LandingNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role?.toUpperCase()) {
      case 'RECRUITER': return '/recruiter';
      case 'ADMIN': return '/admin';
      default: return '/job-seeker/dashboard';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMobile();
  };

  return (
    <header className="nexstep-navbar">
      <div className="nexstep-navbar-container">
        <Link to="/" className="nexstep-logo" onClick={closeMobile}>
          <div className="nexstep-logo-icon">
            <Briefcase size={20} />
          </div>
          <span className="nexstep-logo-text">TalentPulse</span>
        </Link>

        <div className="nexstep-nav-actions">
          {isAuthenticated && user ? (
            <div className="nexstep-user-actions">
              <Link to={getDashboardPath()} className="nexstep-btn-primary">
                Dashboard
                <ArrowRight size={14} />
              </Link>
              <button onClick={handleLogout} className="nexstep-btn-outline">
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="nexstep-auth-actions">
              <Link to="/login" className="nexstep-btn-secondary">
                LOGIN
              </Link>
              <Link to="/register" className="nexstep-btn-primary">
                GET STARTED
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          <ThemeToggle />

          <button
            className="nexstep-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nexstep-mobile-drawer">
          <div className="mobile-actions-list">
            <div className="flex-align-center justify-between" style={{ padding: '0.25rem 0' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>Theme</span>
              <ThemeToggle />
            </div>
            {isAuthenticated && user ? (
              <>
                <div className="mobile-user-info">
                  <UserCheck size={15} />
                  <span>{user.email}</span>
                </div>
                <Link to={getDashboardPath()} className="nexstep-btn-primary full-w" onClick={closeMobile}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="nexstep-btn-outline full-w">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nexstep-btn-secondary full-w" onClick={closeMobile}>
                  LOGIN
                </Link>
                <Link to="/register" className="nexstep-btn-primary full-w" onClick={closeMobile}>
                  GET STARTED
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
