import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Users,
  RotateCcw,
  Clock,
} from 'lucide-react';

const getJobStatusBadge = (status) => {
  const normalized = (status || 'ACTIVE').toUpperCase();
  switch (normalized) {
    case 'ACTIVE':
    case 'PUBLISHED':
      return <span className="badge badge-success">ACTIVE</span>;
    case 'DRAFT':
      return <span className="badge badge-warning">DRAFT</span>;
    case 'CLOSED':
    default:
      return <span className="badge badge-secondary">CLOSED</span>;
  }
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;

    adminService
      .getAdminJobs()
      .then((data) => {
        if (isMounted) setJobs(data || []);
      })
      .catch((err) => {
        console.error('Failed to load admin jobs:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const locationOptions = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location).filter(Boolean));
    return Array.from(set).sort();
  }, [jobs]);

  const statusTabs = [
    { label: 'All Jobs', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Drafts', value: 'DRAFT' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = (job.status || 'ACTIVE').toUpperCase();

      // Status Filter
      if (statusFilter !== 'ALL' && status !== statusFilter) {
        return false;
      }

      // Location Filter
      if (locationFilter !== 'ALL' && job.location !== locationFilter) {
        return false;
      }

      // Search Query (Title, Company, Skills)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = (job.title || '').toLowerCase().includes(query);
        const matchesCompany = (job.company || job.companyName || '').toLowerCase().includes(query);
        const matchesDept = (job.department || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesDept) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, statusFilter, locationFilter, searchTerm]);

  return (
    <div className="admin-jobs-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Platform Job Requisitions</h1>
          <p className="page-subtitle">
            Administrative monitoring and visibility into all open, draft, and closed enterprise requisitions.
          </p>
        </div>
      </div>

      {/* Control Bar: Status Tabs, Location Filter, Search */}
      <div className="apps-control-bar admin-control-bar">
        <div className="control-bar-top-row">
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

          <div className="status-select-wrapper">
            <label htmlFor="locationSelect" className="control-label text-xs font-bold text-muted">
              Location:
            </label>
            <select
              id="locationSelect"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="form-control form-control-sm status-filter-dropdown"
            >
              <option value="ALL">All Locations</option>
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="apps-search-wrapper mt-2">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search platform jobs by title, company name, or department..."
            className="apps-search-input"
          />
        </div>
      </div>

      {/* Job Listings Table / Cards */}
      {loading ? (
        <div className="card text-center p-5">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Loading platform job requisitions...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">
            <Briefcase size={36} />
          </div>
          <h3>No Jobs Found</h3>
          <p>No job requisitions exist in the platform database.</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">
            <Search size={36} />
          </div>
          <h3>No Matching Job Requisitions</h3>
          <p>No job postings match your current search query or status filter.</p>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setLocationFilter('ALL');
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
          <table className="applications-table admin-jobs-table">
            <thead>
              <tr>
                <th>Job Requisition & Company</th>
                <th>Status</th>
                <th>Location & Type</th>
                <th>Applicants</th>
                <th>Dates (Posted / Deadline)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div className="app-job-info">
                      <div className="app-company-logo">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <Link to={`/jobs/${job.id}`} className="app-job-title-link">
                          {job.title}
                        </Link>
                        <p className="app-company-sub">
                          {job.company || job.companyName} &bull;{' '}
                          <span className="text-muted">{job.department || 'Engineering'}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {getJobStatusBadge(job.status)}
                  </td>
                  <td>
                    <div className="td-dept-cell">
                      <span className="flex-align-center gap-1 text-sm font-semibold">
                        <MapPin size={13} className="text-muted" />
                        {job.location} {job.isRemote ? '(Remote)' : ''}
                      </span>
                      <span className="text-xs text-muted">
                        {job.employmentType || 'Full Time'} &bull; {job.salary || job.salaryRange || 'Competitive'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex-align-center gap-1">
                      <Users size={14} className="text-indigo" />
                      <strong className="text-indigo">{job.applicants || job.applicantCount || 0}</strong>
                      <span className="text-xs text-muted">candidates</span>
                    </div>
                  </td>
                  <td>
                    <div className="td-date-cell">
                      <span className="text-xs text-muted flex-align-center gap-1">
                        <Calendar size={12} /> Posted: {job.postedDate}
                      </span>
                      {job.deadline && (
                        <span className="text-xs text-muted flex-align-center gap-1 mt-1">
                          <Clock size={12} /> Deadline: {job.deadline}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn btn-outline btn-xs flex-align-center gap-1"
                      title="View Candidate-Facing Requisition Posting"
                    >
                      <ExternalLink size={13} />
                      <span>View Post</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List View */}
          <div className="mobile-apps-cards admin-mobile-job-cards">
            {filteredJobs.map((job) => (
              <div key={job.id} className="mobile-app-card">
                <div className="mac-header">
                  <div>
                    <h3 className="mac-title">{job.title}</h3>
                    <p className="mac-company">{job.company || job.companyName}</p>
                  </div>
                  {getJobStatusBadge(job.status)}
                </div>

                <div className="mac-meta mt-2">
                  <span>
                    <MapPin size={13} style={{ marginRight: 4 }} />
                    {job.location}
                  </span>
                  <span>
                    <Users size={13} style={{ marginRight: 4 }} />
                    {job.applicants || job.applicantCount || 0} Applicants
                  </span>
                  <span>Posted: {job.postedDate}</span>
                </div>

                <div className="mac-footer mt-3">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="btn btn-outline btn-sm btn-block flex-align-center justify-center gap-1"
                  >
                    <span>View Requisition Posting</span>
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

export default AdminJobs;
