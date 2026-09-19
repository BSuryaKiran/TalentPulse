import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  User,
  LogOut,
  ChevronRight,
  Building2,
} from 'lucide-react';

const RecruiterSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/recruiter/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'Manage Jobs',
      path: '/recruiter/jobs',
      icon: <Briefcase size={18} />,
    },
    {
      label: 'Applicants',
      path: '/recruiter/applicants',
      icon: <Users size={18} />,
    },
    {
      label: 'Profile',
      path: '/recruiter/profile',
      icon: <User size={18} />,
    },
  ];

  const userInitial = (user?.name || user?.email || 'R').charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`recruiter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-portal-title recruiter-portal-title">
            <Building2 size={18} />
            <span>Employer Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-text">{item.label}</span>
              <ChevronRight size={14} className="link-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar recruiter-avatar">{userInitial}</div>
            <div className="user-details">
              <span className="user-display-name">{user?.name || 'Recruiter'}</span>
              <span className="user-display-email">{user?.email}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default RecruiterSidebar;
