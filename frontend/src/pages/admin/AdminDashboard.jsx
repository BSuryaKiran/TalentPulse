import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import adminService from '../../services/adminService';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminActivity from '../../components/admin/AdminActivity';
import {
  Shield,
  Users,
  Briefcase,
  FileCheck2,
  Server,
  ArrowRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      adminService.getPlatformStats(),
      adminService.getRecentActivities(),
    ])
      .then(([statsData, activityData]) => {
        if (isMounted) {
          setStats(statsData);
          setActivities(activityData || []);
        }
      })
      .catch((err) => {
        console.error('Failed to load admin dashboard analytics:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="admin-dashboard-page">
        <div className="card max-w-xl mx-auto my-5 p-5 text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Loading enterprise administration dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate percentage distributions
  const totalUsers = stats.totalUsers || 1;
  const seekerPct = Math.round((stats.jobSeekersCount / totalUsers) * 100);
  const recruiterPct = Math.round((stats.recruitersCount / totalUsers) * 100);
  const adminPct = Math.round((stats.adminsCount / totalUsers) * 100);

  const totalJobs = stats.totalJobs || 1;
  const activeJobPct = Math.round((stats.activeJobsCount / totalJobs) * 100);
  const draftJobPct = Math.round((stats.draftJobsCount / totalJobs) * 100);
  const closedJobPct = Math.round((stats.closedJobsCount / totalJobs) * 100);

  const totalApps = stats.totalApplications || 1;
  const appliedPct = Math.round((stats.appliedCount / totalApps) * 100);
  const reviewPct = Math.round((stats.underReviewCount / totalApps) * 100);
  const shortlistPct = Math.round((stats.shortlistedCount / totalApps) * 100);
  const selectPct = Math.round((stats.selectedCount / totalApps) * 100);

  return (
    <div className="admin-dashboard-page">
      {/* Admin Welcome Banner */}
      <div className="welcome-banner admin-welcome-banner">
        <div className="banner-text">
          <div className="banner-pill admin-pill">
            <Shield size={14} />
            <span>Platform Administration</span>
          </div>
          <h1>Admin Dashboard</h1>
          <p>
            Monitor and manage the TalentPulse platform &bull; Logged in as{' '}
            <strong>{user?.name || user?.email || 'Administrator'}</strong>
          </p>
        </div>
        <div className="banner-actions">
          <Link to="/admin/system" className="btn btn-primary flex-align-center gap-1">
            <Server size={16} />
            <span>System Overview</span>
          </Link>
        </div>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="stats-grid admin-stats-grid">
        <AdminStatCard
          title="Total Registered Users"
          value={stats.totalUsers}
          subtitle={`${stats.jobSeekersCount} Candidates • ${stats.recruitersCount} Recruiters`}
          icon={<Users size={22} />}
          iconBg="icon-blue"
          link="/admin/users"
          linkText="Manage Users"
        />

        <AdminStatCard
          title="Active Requisitions"
          value={stats.activeJobsCount}
          subtitle={`${stats.totalJobs} Total Jobs • ${stats.closedJobsCount} Closed`}
          icon={<Briefcase size={22} />}
          iconBg="icon-emerald"
          link="/admin/jobs"
          linkText="View All Jobs"
        />

        <AdminStatCard
          title="Total Applications"
          value={stats.totalApplications}
          subtitle={`${stats.underReviewCount} Under Review • ${stats.shortlistedCount} Shortlisted`}
          icon={<FileCheck2 size={22} />}
          iconBg="icon-indigo"
          link="/admin/applications"
          linkText="View Pipeline"
        />

        <AdminStatCard
          title="Microservices Registry"
          value={`${stats.onlineServicesCount} / ${stats.totalServices} Active`}
          subtitle="Eureka, Gateway, Auth, Profile, Jobs, Apps"
          icon={<Server size={22} />}
          iconBg="icon-amber"
          link="/admin/system"
          linkText="Check Health"
        />
      </div>

      {/* Main Admin Columns: Left (Distributions & Quick Actions) / Right (Activity Stream) */}
      <div className="dashboard-columns admin-dashboard-columns">
        {/* Left Column */}
        <div className="dashboard-main-col">
          {/* Quick Action Shortcuts */}
          <div className="section-card mb-4">
            <div className="section-card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-grid admin-quick-grid">
              <Link to="/admin/users" className="quick-action-card">
                <div className="qa-icon icon-blue">
                  <Users size={20} />
                </div>
                <div className="qa-text">
                  <h3>Manage Users</h3>
                  <p>Browse, inspect, and toggle user account statuses</p>
                </div>
                <ArrowRight size={16} className="qa-arrow" />
              </Link>

              <Link to="/admin/jobs" className="quick-action-card">
                <div className="qa-icon icon-emerald">
                  <Briefcase size={20} />
                </div>
                <div className="qa-text">
                  <h3>Platform Jobs</h3>
                  <p>Monitor all active enterprise job requisitions</p>
                </div>
                <ArrowRight size={16} className="qa-arrow" />
              </Link>

              <Link to="/admin/applications" className="quick-action-card">
                <div className="qa-icon icon-indigo">
                  <FileCheck2 size={20} />
                </div>
                <div className="qa-text">
                  <h3>Applications</h3>
                  <p>Track candidate application pipelines and submissions</p>
                </div>
                <ArrowRight size={16} className="qa-arrow" />
              </Link>

              <Link to="/admin/system" className="quick-action-card">
                <div className="qa-icon icon-amber">
                  <Server size={20} />
                </div>
                <div className="qa-text">
                  <h3>System Overview</h3>
                  <p>Inspect microservices topology, ports & gateway routes</p>
                </div>
                <ArrowRight size={16} className="qa-arrow" />
              </Link>
            </div>
          </div>

          {/* Platform Distribution Visualizations */}
          <div className="section-card mb-4">
            <div className="section-card-header">
              <h2>Platform Overview & Breakdown</h2>
            </div>

            <div className="distribution-sections-list">
              {/* 1. User Distribution */}
              <div className="dist-section">
                <div className="dist-header">
                  <span className="dist-title">User Role Distribution</span>
                  <span className="dist-meta">{stats.totalUsers} Total Accounts</span>
                </div>
                <div className="progress-stacked-bar">
                  <div
                    className="prog-segment seg-blue"
                    style={{ width: `${seekerPct}%` }}
                    title={`Job Seekers: ${stats.jobSeekersCount} (${seekerPct}%)`}
                  />
                  <div
                    className="prog-segment seg-emerald"
                    style={{ width: `${recruiterPct}%` }}
                    title={`Recruiters: ${stats.recruitersCount} (${recruiterPct}%)`}
                  />
                  <div
                    className="prog-segment seg-purple"
                    style={{ width: `${adminPct}%` }}
                    title={`Admins: ${stats.adminsCount} (${adminPct}%)`}
                  />
                </div>
                <div className="dist-legend">
                  <span className="legend-item">
                    <span className="legend-dot dot-blue" />
                    <span>Job Seekers ({stats.jobSeekersCount})</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-emerald" />
                    <span>Recruiters ({stats.recruitersCount})</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-purple" />
                    <span>Admins ({stats.adminsCount})</span>
                  </span>
                </div>
              </div>

              {/* 2. Job Requisition Status Breakdown */}
              <div className="dist-section mt-4">
                <div className="dist-header">
                  <span className="dist-title">Job Requisitions Status</span>
                  <span className="dist-meta">{stats.totalJobs} Total Requisitions</span>
                </div>
                <div className="progress-stacked-bar">
                  <div
                    className="prog-segment seg-emerald"
                    style={{ width: `${activeJobPct}%` }}
                    title={`Active: ${stats.activeJobsCount} (${activeJobPct}%)`}
                  />
                  <div
                    className="prog-segment seg-amber"
                    style={{ width: `${draftJobPct}%` }}
                    title={`Drafts: ${stats.draftJobsCount} (${draftJobPct}%)`}
                  />
                  <div
                    className="prog-segment seg-slate"
                    style={{ width: `${closedJobPct}%` }}
                    title={`Closed: ${stats.closedJobsCount} (${closedJobPct}%)`}
                  />
                </div>
                <div className="dist-legend">
                  <span className="legend-item">
                    <span className="legend-dot dot-emerald" />
                    <span>Active ({stats.activeJobsCount})</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-amber" />
                    <span>Drafts ({stats.draftJobsCount})</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-slate" />
                    <span>Closed ({stats.closedJobsCount})</span>
                  </span>
                </div>
              </div>

              {/* 3. Application Pipeline Breakdown */}
              <div className="dist-section mt-4">
                <div className="dist-header">
                  <span className="dist-title">Application Pipeline Stages</span>
                  <span className="dist-meta">{stats.totalApplications} Submissions</span>
                </div>
                <div className="progress-stacked-bar">
                  <div
                    className="prog-segment seg-blue"
                    style={{ width: `${appliedPct}%` }}
                    title={`Applied: ${stats.appliedCount} (${appliedPct}%)`}
                  />
                  <div
                    className="prog-segment seg-amber"
                    style={{ width: `${reviewPct}%` }}
                    title={`Under Review: ${stats.underReviewCount} (${reviewPct}%)`}
                  />
                  <div
                    className="prog-segment seg-purple"
                    style={{ width: `${shortlistPct}%` }}
                    title={`Shortlisted: ${stats.shortlistedCount} (${shortlistPct}%)`}
                  />
                  <div
                    className="prog-segment seg-emerald"
                    style={{ width: `${selectPct}%` }}
                    title={`Selected: ${stats.selectedCount} (${selectPct}%)`}
                  />
                </div>
                <div className="dist-legend">
                  <span className="legend-item">
                    <span className="legend-dot dot-blue" />
                    <span>Applied ({stats.appliedCount})</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-amber" />
                    <span>Under Review ({stats.underReviewCount})</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-purple" />
                    <span>Shortlisted ({stats.shortlistedCount})</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-emerald" />
                    <span>Selected ({stats.selectedCount})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Stream */}
        <div className="dashboard-side-col">
          <div className="section-card">
            <div className="section-card-header">
              <h2>Recent Platform Activity</h2>
              <span className="badge badge-info">Live Stream</span>
            </div>

            <div className="admin-activity-stream">
              {activities.length === 0 ? (
                <p className="text-muted text-center p-3">No recent activity.</p>
              ) : (
                activities.slice(0, 6).map((activity) => (
                  <AdminActivity key={activity.id} activity={activity} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
