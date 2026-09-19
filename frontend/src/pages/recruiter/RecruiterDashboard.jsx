import { useAuth } from '../../context/useAuth';
import {
  RECRUITER_STATS,
  RECRUITER_QUICK_ACTIONS,
  RECRUITER_ACTIVITIES,
  getRecruiterProfile,
} from '../../data/recruiter';
import RecruiterStatCard from '../../components/recruiter/RecruiterStatCard';
import RecruiterQuickActions from '../../components/recruiter/RecruiterQuickActions';
import RecruiterActivity from '../../components/recruiter/RecruiterActivity';
import { Building2, Sparkles } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const profile = getRecruiterProfile(user);

  const recruiterName = profile.fullName || user?.name || user?.email || 'Recruiter';
  const companyName = profile.companyName || 'TalentPulse Enterprise';

  return (
    <div className="recruiter-dashboard-page">
      {/* Welcome Banner */}
      <section className="welcome-banner recruiter-banner">
        <div className="banner-content">
          <div className="banner-pill">
            <Building2 size={14} />
            <span>{companyName}</span>
          </div>
          <h1 className="banner-title">
            Welcome back, <span className="highlight-name">{recruiterName}</span> 👋
          </h1>
          <p className="banner-description">
            Here is an overview of your active hiring pipeline, candidate applications, and key recruitment workflows today.
          </p>
        </div>
        <div className="banner-badge-decoration">
          <div className="decoration-circle">
            <Sparkles size={24} />
          </div>
        </div>
      </section>

      {/* Statistics Cards Grid */}
      <section className="stats-section">
        <div className="stats-grid">
          {RECRUITER_STATS.map((stat) => (
            <RecruiterStatCard key={stat.id} {...stat} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <RecruiterQuickActions actions={RECRUITER_QUICK_ACTIONS} />

      {/* Recent Activity Timeline */}
      <RecruiterActivity activities={RECRUITER_ACTIVITIES} />
    </div>
  );
};

export default RecruiterDashboard;
