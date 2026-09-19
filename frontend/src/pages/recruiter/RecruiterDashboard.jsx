import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import {
  RECRUITER_QUICK_ACTIONS,
  RECRUITER_ACTIVITIES,
  getRecruiterProfile,
} from '../../data/recruiter';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import RecruiterStatCard from '../../components/recruiter/RecruiterStatCard';
import RecruiterQuickActions from '../../components/recruiter/RecruiterQuickActions';
import RecruiterActivity from '../../components/recruiter/RecruiterActivity';
import { Building2, Sparkles } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const profile = getRecruiterProfile(user);

  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      jobService.getRecruiterJobs(user),
      applicationService.getRecruiterApplicants(user),
    ])
      .then(([jobData, appData]) => {
        if (isMounted) {
          setJobs(jobData);
          setApplicants(appData);
        }
      })
      .catch((err) => {
        console.warn('Dashboard fetch error:', err.message);
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

  // Dynamic statistics
  const activeJobsCount = jobs.filter((j) => j.status === 'ACTIVE').length;
  const totalApplicantsCount = applicants.length;
  const shortlistedCount = applicants.filter((a) => a.status === 'SHORTLISTED').length;
  const selectedCount = applicants.filter((a) => a.status === 'SELECTED').length;

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
      change: `${shortlistedCount} ready for interview`,
      isPositive: true,
      icon: 'UserCheck',
      color: 'violet',
      description: 'Candidates selected for initial evaluation',
    },
    {
      id: 'stat-interviews',
      title: 'Selected Candidates',
      value: loading ? '...' : String(selectedCount),
      change: `${selectedCount} offer letters extended`,
      isPositive: true,
      icon: 'Calendar',
      color: 'emerald',
      description: 'Candidates selected for final placement',
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
