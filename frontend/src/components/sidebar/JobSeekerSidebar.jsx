import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  LayoutDashboard,
  Search,
  FileCheck2,
  User,
  LogOut,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

const JobSeekerSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/job-seeker/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'Browse Jobs',
      path: '/jobs',
      icon: <Search size={18} />,
    },
    {
      label: 'My Applications',
      path: '/job-seeker/applications',
      icon: <FileCheck2 size={18} />,
    },
    {
      label: 'My Profile',
      path: '/job-seeker/profile',
      icon: <User size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`jobseeker-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-portal-title">
            <Briefcase size={18} />
            <span>Candidate Portal</span>
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
            <div className="user-avatar">
              {(user?.name || user?.email || 'JS').charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-display-name">{user?.name || 'Job Seeker'}</span>
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

export default JobSeekerSidebar;
