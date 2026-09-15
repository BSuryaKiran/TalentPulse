import { useAuth } from '../../context/useAuth';
import { UserCheck, Clock, Briefcase, ChevronRight } from 'lucide-react';

const JobSeekerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-placeholder">
      <div className="placeholder-card">
        <div className="placeholder-badge seeker-badge">
          <UserCheck size={20} />
          <span>Job Seeker Workspace</span>
        </div>
        <h1>Job Seeker Dashboard – Coming Soon</h1>
        <p className="placeholder-description">
          Welcome back, <strong>{user?.name || user?.email || 'Candidate'}</strong>! Phase 1 foundation is complete.
          Job search, recommendations, resume upload, and application tracking will be available in Phase 2.
        </p>

        <div className="placeholder-features">
          <div className="feature-item">
            <Briefcase size={18} />
            <span>Search & Apply to Enterprise Jobs</span>
            <ChevronRight size={16} className="feature-arrow" />
          </div>
          <div className="feature-item">
            <Clock size={18} />
            <span>Track Application Status Real-Time</span>
            <ChevronRight size={16} className="feature-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;

