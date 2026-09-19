import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import ApplicationStatusBadge from '../../components/application/ApplicationStatusBadge';
import {
  FileCheck2,
  Search,
  Calendar,
  ExternalLink,
  RotateCcw,
  Mail,
} from 'lucide-react';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;

    adminService
      .getAdminApplications()
      .then((data) => {
        if (isMounted) setApplications(data || []);
      })
      .catch((err) => {
        console.error('Failed to load admin applications:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const statusTabs = [
    { label: 'All Pipeline', value: 'ALL' },
    { label: 'Applied', value: 'APPLIED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Shortlisted', value: 'SHORTLISTED' },
    { label: 'Selected', value: 'SELECTED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const status = (app.status || 'APPLIED').toUpperCase().replace(/\s+/g, '_');

      // Status Filter
      if (statusFilter !== 'ALL' && status !== statusFilter) {
        return false;
      }

      // Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesCandidate = (app.candidateName || '').toLowerCase().includes(query);
        const matchesEmail = (app.candidateEmail || '').toLowerCase().includes(query);
        const matchesJob = (app.jobTitle || '').toLowerCase().includes(query);
        const matchesCompany = (app.companyName || '').toLowerCase().includes(query);
        if (!matchesCandidate && !matchesEmail && !matchesJob && !matchesCompany) {
          return false;
        }
      }

      return true;
    });
  }, [applications, statusFilter, searchTerm]);

  return (
    <div className="admin-applications-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Platform Application Pipeline</h1>
          <p className="page-subtitle">
            Global administrative visibility and compliance tracking across all candidate submissions.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="apps-control-bar admin-control-bar">
        <div className="status-tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`status-tab ${statusFilter === tab.value ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="apps-search-wrapper mt-2">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by candidate name, email, target position, or company..."
            className="apps-search-input"
          />
        </div>
      </div>

      {/* Applications Table / Cards */}
      {loading ? (
        <div className="card text-center p-5">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Loading platform application pipeline...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">
            <FileCheck2 size={36} />
          </div>
          <h3>No Applications Found</h3>
          <p>No candidate applications currently logged in the platform registry.</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">
            <Search size={36} />
          </div>
          <h3>No Matching Applications</h3>
          <p>No application submissions match your current search query or status filter.</p>
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
        <div className="applications-table-wrapper admin-table-wrapper">
          <table className="applications-table admin-apps-table">
            <thead>
              <tr>
                <th>Candidate Details</th>
                <th>Target Requisition</th>
                <th>Employer / Recruiter</th>
                <th>Application Status</th>
                <th>Applied Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="app-job-info">
                      <div className="admin-table-avatar">
                        {(app.candidateName || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong className="text-main">{app.candidateName}</strong>
                        <p className="app-company-sub text-muted flex-align-center gap-1">
                          <Mail size={12} />
                          <span>{app.candidateEmail}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <Link to={`/jobs/${app.jobId}`} className="app-job-title-link">
                        {app.jobTitle}
                      </Link>
                      <p className="app-company-sub text-muted">
                        Ref: #{app.id}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className="font-semibold text-sm">{app.companyName}</span>
                      <p className="text-xs text-muted">Lead: {app.recruiter || 'Talent Partner'}</p>
                    </div>
                  </td>
                  <td>
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td>
                    <div className="td-date-cell">
                      <span className="text-xs text-muted flex-align-center gap-1">
                        <Calendar size={12} /> {app.appliedDate}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="btn btn-outline btn-xs flex-align-center gap-1"
                      title="View Job Requisition"
                    >
                      <ExternalLink size={13} />
                      <span>View Job</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List View */}
          <div className="mobile-apps-cards admin-mobile-app-cards">
            {filteredApplications.map((app) => (
              <div key={app.id} className="mobile-app-card">
                <div className="mac-header">
                  <div>
                    <h3 className="mac-title">{app.candidateName}</h3>
                    <p className="mac-company">{app.jobTitle} &bull; {app.companyName}</p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>

                <div className="mac-meta mt-2">
                  <span>
                    <Mail size={13} style={{ marginRight: 4 }} />
                    {app.candidateEmail}
                  </span>
                  <span>
                    <Calendar size={13} style={{ marginRight: 4 }} />
                    Applied: {app.appliedDate}
                  </span>
                </div>

                <div className="mac-footer mt-3">
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="btn btn-outline btn-sm btn-block flex-align-center justify-center gap-1"
                  >
                    <span>View Requisition</span>
                    <ExternalLink size={13} />
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

export default AdminApplications;
