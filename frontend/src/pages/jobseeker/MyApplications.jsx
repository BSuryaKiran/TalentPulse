import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import applicationService from '../../services/applicationService';
import ApplicationStatusBadge from '../../components/application/ApplicationStatusBadge';
import {
  FileCheck2,
  Search,
  Calendar,
  Building2,
  ExternalLink,
  Clock,
  Eye,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;

    applicationService
      .getMyApplications(user)
      .then((data) => {
        if (isMounted) setApplications(data || []);
      })
      .catch((err) => {
        console.error('Failed to load applications:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const statusOptions = [
    { label: 'All Applications', value: 'ALL' },
    { label: 'Applied', value: 'APPLIED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Shortlisted', value: 'SHORTLISTED' },
    { label: 'Selected', value: 'SELECTED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Normalize application status for comparison
      const appStatus = (app.status || 'APPLIED').toUpperCase().replace(/\s+/g, '_');

      // Status Filter
      if (statusFilter !== 'ALL' && appStatus !== statusFilter) {
        return false;
      }

      // Search Term Filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = (app.jobTitle || '').toLowerCase().includes(query);
        const matchesCompany = (app.companyName || app.company || '').toLowerCase().includes(query);
        const matchesLoc = (app.location || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesLoc) return false;
      }

      return true;
    });
  }, [applications, statusFilter, searchTerm]);

  return (
    <div className="my-applications-page">
      <div className="page-header">
        <div>
          <h1>My Job Applications</h1>
          <p className="page-subtitle">
            Track real-time status updates and submission timelines for your submitted applications.
          </p>
        </div>
        <Link to="/jobs" className="btn btn-primary">
          <Search size={16} style={{ marginRight: 6 }} />
          Browse More Jobs
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="apps-control-bar">
        <div className="status-tabs">
          {statusOptions.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`status-tab ${statusFilter === tab.value ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="apps-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applications by title, company, or location..."
            className="apps-search-input"
          />
        </div>
      </div>

      {/* Applications Table / Cards */}
      {loading ? (
        <div className="card text-center p-5">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Loading your job applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">
            <FileCheck2 size={36} />
          </div>
          <h3>No Applications Yet</h3>
          <p>
            Start exploring enterprise jobs and apply to career opportunities that match your skills.
          </p>
          <Link to="/jobs" className="btn btn-primary mt-3">
            Browse Jobs
          </Link>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">
            <Search size={36} />
          </div>
          <h3>No Matching Applications</h3>
          <p>
            No applications match your current status filter ({statusFilter}) or search keywords.
          </p>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setSearchTerm('');
            }}
            className="btn btn-outline mt-3 flex-align-center gap-1"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="applications-table-wrapper">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Job Title & Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="app-job-info">
                      <div className="app-company-logo">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <Link
                          to={`/job-seeker/applications/${app.id}`}
                          className="app-job-title-link"
                        >
                          {app.jobTitle}
                        </Link>
                        <p className="app-company-sub">
                          {app.companyName || app.company} •{' '}
                          <span className="app-loc">{app.location || 'Remote'}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="td-date-cell">
                      <Calendar size={14} className="cell-icon" />
                      <span>{app.appliedDate}</span>
                    </div>
                  </td>
                  <td>
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td>
                    <div className="td-date-cell text-muted">
                      <Clock size={14} className="cell-icon" />
                      <span>{app.lastUpdated || app.appliedDate}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions-cell flex-align-center gap-2">
                      <Link
                        to={`/job-seeker/applications/${app.id}`}
                        className="btn btn-primary btn-xs action-view-btn"
                        title="View Application Details"
                      >
                        <Eye size={13} style={{ marginRight: 4 }} />
                        <span>View Status</span>
                      </Link>
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="btn btn-outline btn-xs"
                        title="View Original Job Post"
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List View */}
          <div className="mobile-apps-cards">
            {filteredApplications.map((app) => (
              <div key={app.id} className="mobile-app-card">
                <div className="mac-header">
                  <div>
                    <h3 className="mac-title">{app.jobTitle}</h3>
                    <p className="mac-company">{app.companyName || app.company}</p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>

                <div className="mac-meta">
                  <span>
                    <Calendar size={13} style={{ marginRight: 4 }} />
                    Applied: {app.appliedDate}
                  </span>
                  <span>
                    <Clock size={13} style={{ marginRight: 4 }} />
                    Updated: {app.lastUpdated || app.appliedDate}
                  </span>
                </div>

                <div className="mac-footer flex-align-center gap-2 mt-2">
                  <Link
                    to={`/job-seeker/applications/${app.id}`}
                    className="btn btn-primary btn-sm flex-1 flex-align-center justify-center gap-1"
                  >
                    <span>View Application</span>
                    <ChevronRight size={14} />
                  </Link>
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="btn btn-outline btn-sm"
                    title="View Job"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
