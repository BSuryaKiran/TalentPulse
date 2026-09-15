import { useAuth } from '../../context/useAuth';
import { UserCheck, FileText, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePlaceholder = () => {
  const { user } = useAuth();

  return (
    <div className="profile-placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-badge seeker-badge">
          <UserCheck size={20} />
          <span>Candidate Profile Workspace</span>
        </div>
        <h1>Profile Management – Coming Soon</h1>
        <p className="placeholder-description">
          Welcome, <strong>{user?.name || user?.email || 'Candidate'}</strong>! Profile service integration and full resume management are scheduled for Phase 3.
        </p>

        <div className="profile-preview-box mb-4">
          <div className="pp-item">
            <span className="pp-label">Candidate Name:</span>
            <span className="pp-value">{user?.name || 'Not specified'}</span>
          </div>
          <div className="pp-item">
            <span className="pp-label">Email Address:</span>
            <span className="pp-value">{user?.email}</span>
          </div>
          <div className="pp-item">
            <span className="pp-label">Assigned Role:</span>
            <span className="pp-value">{user?.role}</span>
          </div>
        </div>

        <div className="placeholder-features">
          <div className="feature-item">
            <FileText size={18} />
            <span>Resume & Portfolio Upload (Phase 3)</span>
          </div>
          <div className="feature-item">
            <Sparkles size={18} />
            <span>Skill Tags & Work Experience (Phase 3)</span>
          </div>
          <div className="feature-item">
            <Shield size={18} />
            <span>Profile Visibility & Preferences (Phase 3)</span>
          </div>
        </div>

        <div className="mt-4 pt-3 text-center">
          <Link to="/job-seeker/dashboard" className="btn btn-primary">
            <ArrowLeft size={16} style={{ marginRight: 6 }} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePlaceholder;
