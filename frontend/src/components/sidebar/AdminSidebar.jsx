import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck2,
  Server,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'User Management',
      path: '/admin/users',
      icon: <Users size={18} />,
    },
    {
      label: 'Platform Jobs',
      path: '/admin/jobs',
      icon: <Briefcase size={18} />,
    },
    {
      label: 'Applications',
      path: '/admin/applications',
      icon: <FileCheck2 size={18} />,
    },
    {
      label: 'System Overview',
      path: '/admin/system',
      icon: <Server size={18} />,
    },
  ];

  const userInitial = (user?.name || user?.email || 'A').charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-portal-title admin-portal-title">
            <Shield size={18} />
            <span>Admin Workspace</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Enterprise Administration</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-text">{item.label}</span>
              <ChevronRight size={14} className="link-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-card admin-user-card">
            <div className="user-avatar admin-avatar">{userInitial}</div>
            <div className="user-details">
              <span className="user-display-name">{user?.name || 'Administrator'}</span>
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

export default AdminSidebar;
