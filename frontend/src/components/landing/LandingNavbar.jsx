import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  Briefcase, Menu, X, ArrowRight, UserCheck, LogOut, Zap, Building2, Shield, ChevronDown,
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    roleKey: 'JOB_SEEKER',
    label: 'Job Seeker',
    email: 'seeker@talentpulse.com',
    password: 'password123',
    icon: <UserCheck size={15} className="text-blue" />,
    targetPath: '/job-seeker/dashboard',
  },
  {
    roleKey: 'RECRUITER',
    label: 'Recruiter',
    email: 'recruiter@talentpulse.com',
    password: 'password123',
    icon: <Building2 size={15} className="text-purple" />,
    targetPath: '/recruiter',
  },
  {
    roleKey: 'ADMIN',
    label: 'Administrator',
    email: 'admin@talentpulse.com',
    password: 'password123',
    icon: <Shield size={15} className="text-amber" />,
    targetPath: '/admin',
  },
];

const LandingNavbar = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

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

  const handleDemoLogin = async (account) => {
    setDemoOpen(false);
    closeMobile();
    try {
      await login(account.email, account.password);
      navigate(account.targetPath, { replace: true });
    } catch (err) {
      console.error('Demo login error:', err);
    }
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
          {/* Quick Demo Dropdown */}
          <div className="demo-dropdown-wrapper">
            <button
              type="button"
              onClick={() => setDemoOpen(!demoOpen)}
              className="nexstep-btn-quick-demo"
            >
              <Zap size={14} className="animate-pulse" />
              <span>Quick Demo</span>
              <ChevronDown size={13} className={`chevron ${demoOpen ? 'open' : ''}`} />
            </button>

            {demoOpen && (
              <div className="demo-dropdown-menu">
                <div className="dd-header">Test a Role</div>
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.roleKey}
                    type="button"
                    onClick={() => handleDemoLogin(acc)}
                    className="dd-item"
                  >
                    <div className="dd-item-left">
                      {acc.icon}
                      <span className="dd-title">{acc.label}</span>
                    </div>
                    <ArrowRight size={13} className="dd-arrow" />
                  </button>
                ))}
              </div>
            )}
          </div>

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
          <div className="mobile-demo-box">
            <div className="mobile-demo-label">⚡ Instant Role Switcher</div>
            <div className="mobile-demo-grid">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.roleKey}
                  type="button"
                  onClick={() => handleDemoLogin(acc)}
                  className="mobile-demo-btn"
                >
                  {acc.icon}
                  <span>{acc.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mobile-actions-list">
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
