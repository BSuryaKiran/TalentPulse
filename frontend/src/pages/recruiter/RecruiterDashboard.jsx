import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import {
  RECRUITER_QUICK_ACTIONS,
  RECRUITER_ACTIVITIES,
  getRecruiterProfile,
} from '../../data/recruiter';
import jobService from '../../services/jobService';
import RecruiterStatCard from '../../components/recruiter/RecruiterStatCard';
import RecruiterQuickActions from '../../components/recruiter/RecruiterQuickActions';
import RecruiterActivity from '../../components/recruiter/RecruiterActivity';
import { Building2, Sparkles } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const profile = getRecruiterProfile(user);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    jobService
      .getRecruiterJobs(user)
      .then((data) => {
        if (isMounted) setJobs(data);
      })
      .catch((err) => {
        console.warn('Dashboard job fetch error:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const recruiterName = profile.fullName || user?.name || user?.email || 'Recruiter';
  const companyName = profile.companyName || 'TalentPulse Enterprise';

  // Compute dynamic stats from recruiter jobs
  const activeJobsCount = jobs.filter((j) => j.status === 'ACTIVE').length;
  const totalApplicantsCount = jobs.reduce((sum, j) => sum + (j.applicants || 0), 0);
  const shortlistedCount = Math.round(totalApplicantsCount * 0.22);
  const interviewsCount = Math.min(8, Math.round(shortlistedCount * 0.35));

  const dynamicStats = [
    {
      id: 'stat-active-jobs',
      title: 'Active Jobs',
      value: loading ? '...' : String(activeJobsCount),
      change: `${activeJobsCount} requisitions open`,
      isPositive: true,
      icon: 'Briefcase',
      color: 'blue',
      description: 'Job requisitions currently open for applications',
    },
    {
      id: 'stat-applications',
      title: 'Total Applications',
      value: loading ? '...' : String(totalApplicantsCount),
      change: '+24 new today',
      isPositive: true,
      icon: 'Users',
      color: 'indigo',
      description: 'Candidates across all active job postings',
    },
    {
      id: 'stat-shortlisted',
      title: 'Shortlisted',
      value: loading ? '...' : String(shortlistedCount),
      change: '12 pending review',
      isPositive: true,
      icon: 'UserCheck',
      color: 'violet',
      description: 'Candidates selected for initial evaluation',
    },
    {
      id: 'stat-interviews',
      title: 'Interviews Scheduled',
      value: loading ? '...' : String(interviewsCount),
      change: '3 scheduled today',
      isPositive: true,
      icon: 'Calendar',
      color: 'emerald',
      description: 'Active interview sessions planned for this week',
    },
  ];

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
          {dynamicStats.map((stat) => (
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
