import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getApplications } from '../../data/applications';
import JobStatusBadge from '../../components/job/JobStatusBadge';
import {
  FileCheck2,
  Search,
  Calendar,
  Building2,
  ExternalLink,
  Clock,
} from 'lucide-react';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState(() => getApplications(user?.email));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    setApplications(getApplications(user?.email));
  }, [user?.email]);

  const statusOptions = [
    { label: 'All Applications', value: 'ALL' },
    { label: 'Applied', value: 'APPLIED' },
    { label: 'Under Review', value: 'UNDER REVIEW' },
    { label: 'Shortlisted', value: 'SHORTLISTED' },
    { label: 'Selected', value: 'SELECTED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status Filter
      if (
        statusFilter !== 'ALL' &&
        app.status?.toUpperCase() !== statusFilter.toUpperCase()
      ) {
        return false;
      }

      // Search Term Filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = app.jobTitle.toLowerCase().includes(query);
        const matchesCompany = app.company.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany) return false;
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
          Apply to More Jobs
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
            placeholder="Search applications by title or company..."
            className="apps-search-input"
          />
        </div>
      </div>

      {/* Applications Table / Cards */}
      {filteredApplications.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">
            <FileCheck2 size={36} />
          </div>
          <h3>No Applications Found</h3>
          <p>
            {statusFilter !== 'ALL' || searchTerm
              ? 'No applications match your current status or search filter.'
              : 'You have not submitted any job applications yet.'}
          </p>
          <Link to="/jobs" className="btn btn-primary mt-3">
            Browse Available Positions
          </Link>
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
                        <Link to={`/jobs/${app.jobId}`} className="app-job-title-link">
                          {app.jobTitle}
                        </Link>
                        <p className="app-company-sub">
                          {app.company} • <span className="app-loc">{app.location || 'Remote'}</span>
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
                    <JobStatusBadge status={app.status} />
                  </td>
                  <td>
                    <div className="td-date-cell text-muted">
                      <Clock size={14} className="cell-icon" />
                      <span>{app.lastUpdated || app.appliedDate}</span>
                    </div>
                  </td>
                  <td>
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="btn btn-outline btn-sm action-view-btn"
                    >
                      <span>View Job</span>
                      <ExternalLink size={14} />
                    </Link>
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
                    <p className="mac-company">{app.company}</p>
                  </div>
                  <JobStatusBadge status={app.status} />
                </div>

                <div className="mac-meta">
                  <span>
                    <Calendar size={13} style={{ marginRight: 4 }} />
                    Applied: {app.appliedDate}
                  </span>
                  <span>
                    <Clock size={13} style={{ marginRight: 4 }} />
                    Updated: {app.lastUpdated}
                  </span>
                </div>

                <div className="mac-footer">
                  <Link to={`/jobs/${app.jobId}`} className="btn btn-outline btn-sm btn-block">
                    View Details
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
