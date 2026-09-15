import { useAuth } from '../../context/useAuth';
import { Building2, Users, FilePlus, ChevronRight } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-placeholder">
      <div className="placeholder-card">
        <div className="placeholder-badge recruiter-badge">
          <Building2 size={20} />
          <span>Recruiter Workspace</span>
        </div>
        <h1>Recruiter Dashboard – Coming Soon</h1>
        <p className="placeholder-description">
          Welcome back, <strong>{user?.name || user?.email || 'Recruiter'}</strong>! Phase 1 foundation is complete.
          Job posting management, candidate screening, and pipeline analytics will be available in Phase 2.
        </p>

        <div className="placeholder-features">
          <div className="feature-item">
            <FilePlus size={18} />
            <span>Post & Manage Job Requisitions</span>
            <ChevronRight size={16} className="feature-arrow" />
          </div>
          <div className="feature-item">
            <Users size={18} />
            <span>Review Candidate Applications</span>
            <ChevronRight size={16} className="feature-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

