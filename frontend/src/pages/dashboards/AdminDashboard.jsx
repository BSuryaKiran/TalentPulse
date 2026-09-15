import { useAuth } from '../../context/useAuth';
import { ShieldAlert, Settings, Server, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-placeholder">
      <div className="placeholder-card">
        <div className="placeholder-badge admin-badge">
          <ShieldAlert size={20} />
          <span>System Administration</span>
        </div>
        <h1>Admin Dashboard – Coming Soon</h1>
        <p className="placeholder-description">
          Welcome back, <strong>{user?.name || user?.email || 'Administrator'}</strong>! Phase 1 foundation is complete.
          User management, role assignments, audit logs, and microservice status will be available in Phase 2.
        </p>

        <div className="placeholder-features">
          <div className="feature-item">
            <Settings size={18} />
            <span>Manage Platform Users & Roles</span>
            <ChevronRight size={16} className="feature-arrow" />
          </div>
          <div className="feature-item">
            <Server size={18} />
            <span>Monitor Microservice Gateway & Registry</span>
            <ChevronRight size={16} className="feature-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

