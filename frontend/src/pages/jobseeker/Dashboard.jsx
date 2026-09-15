import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getJobs } from '../../data/jobs';
import { getApplications } from '../../data/applications';
import JobStatusBadge from '../../components/job/JobStatusBadge';
import {
  Briefcase,
  FileCheck2,
  Clock,
  Award,
  ArrowRight,
  Search,
  User,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs] = useState(getJobs);
  const [applications, setApplications] = useState(() => getApplications(user?.email));

  // Sync applications when user changes
  useEffect(() => {
    setApplications(getApplications(user?.email));
  }, [user?.email]);

  // Compute stat counts dynamically
  const totalJobsCount = jobs.length;
  const submittedCount = applications.length;
  const underReviewCount = applications.filter(
    (app) => app.status?.toUpperCase() === 'UNDER REVIEW'
  ).length;
  const shortlistedCount = applications.filter(
    (app) => app.status?.toUpperCase() === 'SHORTLISTED'
  ).length;

  // Recent 4 jobs and recent 3 applications
  const recentJobs = jobs.slice(0, 4);
  const recentApplications = applications.slice(0, 3);

  return (
    <div className="dashboard-page">
      {/* Candidate Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-text">
          <div className="banner-pill">
            <Sparkles size={14} />
            <span>Candidate Dashboard</span>
          </div>
          <h1>
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'Candidate'}!
          </h1>
          <p>
            Track your job applications, discover new enterprise opportunities, and manage your talent journey.
          </p>
        </div>
        <div className="banner-actions">
          <Link to="/jobs" className="btn btn-primary">
            <Search size={16} style={{ marginRight: 6 }} />
            Explore Open Jobs
          </Link>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper icon-blue">
            <Briefcase size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalJobsCount}</span>
            <span className="stat-label">Available Jobs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-indigo">
            <FileCheck2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{submittedCount}</span>
            <span className="stat-label">Applications Submitted</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-amber">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{underReviewCount}</span>
            <span className="stat-label">Applications Under Review</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-emerald">
            <Award size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{shortlistedCount}</span>
            <span className="stat-label">Shortlisted Applications</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout Columns */}
      <div className="dashboard-columns">
        {/* Left Column: Recent Jobs & Quick Actions */}
        <div className="dashboard-main-col">
          {/* Quick Actions */}
          <div className="section-card">
            <div className="section-card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              <Link to="/jobs" className="quick-action-card">
                <div className="qa-icon">
                  <Search size={20} />
                </div>
                <div className="qa-text">
                  <h3>Browse Jobs</h3>
                  <p>Explore all active enterprise job postings</p>
                </div>
                <ArrowRight size={16} className="qa-arrow" />
              </Link>

              <Link to="/job-seeker/applications" className="quick-action-card">
                <div className="qa-icon">
                  <FileCheck2 size={20} />
                </div>
                <div className="qa-text">
                  <h3>My Applications</h3>
                  <p>Review the status of your submitted applications</p>
                </div>
                <ArrowRight size={16} className="qa-arrow" />
              </Link>

              <Link to="/job-seeker/profile" className="quick-action-card">
                <div className="qa-icon">
                  <User size={20} />
                </div>
                <div className="qa-text">
                  <h3>View Profile</h3>
                  <p>Check candidate profile & resume settings</p>
                </div>
                <ArrowRight size={16} className="qa-arrow" />
              </Link>
            </div>
          </div>

          {/* Recent Jobs Section */}
          <div className="section-card">
            <div className="section-card-header">
              <h2>Featured Openings</h2>
              <Link to="/jobs" className="section-link">
                <span>View All Jobs</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="dashboard-jobs-list">
              {recentJobs.map((job) => (
                <div key={job.id} className="dashboard-job-item">
                  <div className="dji-logo">
                    <Building2 size={20} />
                  </div>
                  <div className="dji-info">
                    <h3 className="dji-title">{job.title}</h3>
                    <p className="dji-meta">
                      <span>{job.company}</span> • <span>{job.location}</span> •{' '}
                      <span className="badge-tag">{job.employmentType}</span>
                    </p>
                  </div>
                  <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Application Activity */}
        <div className="dashboard-side-col">
          <div className="section-card">
            <div className="section-card-header">
              <h2>Recent Applications</h2>
              <Link to="/job-seeker/applications" className="section-link">
                <span>View All</span>
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="empty-state-mini">
                <p>No applications submitted yet.</p>
                <Link to="/jobs" className="btn btn-primary btn-sm mt-2">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="recent-apps-list">
                {recentApplications.map((app) => (
                  <div key={app.id} className="recent-app-item">
                    <div className="rai-header">
                      <h4 className="rai-title">{app.jobTitle}</h4>
                      <JobStatusBadge status={app.status} />
                    </div>
                    <p className="rai-company">{app.company}</p>
                    <div className="rai-footer">
                      <span className="rai-date">
                        <Calendar size={12} style={{ marginRight: 4 }} />
                        Applied: {app.appliedDate}
                      </span>
                      <Link to={`/jobs/${app.jobId}`} className="rai-link">
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
