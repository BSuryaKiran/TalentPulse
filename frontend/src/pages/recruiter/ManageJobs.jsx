import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import jobService from '../../services/jobService';
import ConfirmationModal from '../../components/recruiter/ConfirmationModal';
import {
  PlusCircle,
  Search,
  Briefcase,
  CheckCircle2,
  FileText,
  XCircle,
  Eye,
  Edit,
  Trash2,
  PowerOff,
  Users,
  MapPin,
  Layers,
  ArrowUpDown,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const ManageJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Search & Filter controls
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Confirmation modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    jobId: null,
    type: null, // 'TOGGLE_STATUS' | 'DELETE'
    title: '',
    message: '',
    confirmText: '',
    confirmVariant: 'danger',
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const data = await jobService.getRecruiterJobs(user);
      setJobs(data);
    } catch (err) {
      setApiError(err.message || 'Failed to load job requisitions.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Compute KPI Counts
  const kpis = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter((j) => j.status === 'ACTIVE').length;
    const draft = jobs.filter((j) => j.status === 'DRAFT').length;
    const closed = jobs.filter((j) => j.status === 'CLOSED').length;
    return { total, active, draft, closed };
  }, [jobs]);

  // Filter & Sort Pipeline
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        if (statusFilter !== 'ALL' && job.status !== statusFilter) {
          return false;
        }
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = job.title?.toLowerCase().includes(query);
          const matchCompany = job.company?.toLowerCase().includes(query);
          const matchLocation = job.location?.toLowerCase().includes(query);
          if (!matchTitle && !matchCompany && !matchLocation) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') {
          return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
        }
        if (sortBy === 'OLDEST') {
          return new Date(a.postedDate || 0) - new Date(b.postedDate || 0);
        }
        if (sortBy === 'APPLICANTS') {
          return (b.applicants || 0) - (a.applicants || 0);
        }
        return 0;
      });
  }, [jobs, searchTerm, statusFilter, sortBy]);

  // Modal Action Prompts
  const promptToggleStatus = (job) => {
    const isClosed = job.status === 'CLOSED';
    setModalConfig({
      isOpen: true,
      jobId: job.id,
      type: 'TOGGLE_STATUS',
      title: isClosed ? 'Reopen Requisition?' : 'Close Requisition?',
      message: isClosed
        ? `Reopening "${job.title}" will allow new candidates to apply.`
        : `Closing "${job.title}" will stop new candidates from submitting applications.`,
      confirmText: isClosed ? 'Reopen Requisition' : 'Close Requisition',
      confirmVariant: isClosed ? 'primary' : 'warning',
    });
  };

  const promptDelete = (job) => {
    setModalConfig({
      isOpen: true,
      jobId: job.id,
      type: 'DELETE',
      title: 'Delete Job Requisition?',
      message: `Are you sure you want to delete "${job.title}"? This action is permanent and cannot be undone.`,
      confirmText: 'Delete Requisition',
      confirmVariant: 'danger',
    });
  };

  const handleModalConfirm = async () => {
    const { jobId, type } = modalConfig;
    setModalConfig({ isOpen: false, jobId: null, type: null });
    setApiError('');
    setActionSuccess('');

    try {
      if (type === 'TOGGLE_STATUS') {
        const targetJob = jobs.find((j) => j.id === jobId);
        if (targetJob) {
          if (targetJob.status === 'CLOSED') {
            await jobService.publishJob(jobId, user);
            setActionSuccess('Job requisition reopened successfully.');
          } else {
            await jobService.closeJob(jobId, user);
            setActionSuccess('Job requisition closed successfully.');
          }
        }
      } else if (type === 'DELETE') {
        await jobService.deleteJob(jobId, user);
        setActionSuccess('Job requisition deleted successfully.');
      }
      fetchJobs();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setApiError(err.message || 'Operation failed.');
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge badge-success">ACTIVE</span>;
      case 'DRAFT':
        return <span className="badge badge-warning">DRAFT</span>;
      case 'CLOSED':
        return <span className="badge badge-secondary">CLOSED</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="manage-jobs-page">
      {/* Top Banner Row */}
      <div className="page-header-row mb-4">
        <div>
          <h1 className="page-title">Manage Jobs</h1>
          <p className="page-subtitle">
            Create, edit, track, and manage job requisitions for your organization.
          </p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="alert alert-success mb-3 flex-align-center gap-2">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* API Error Alert */}
      {apiError && (
        <div className="alert alert-danger mb-3 flex-between">
          <div className="flex-align-center gap-2">
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </div>
          <button onClick={fetchJobs} className="btn btn-xs btn-outline">
            <RefreshCw size={12} style={{ marginRight: 4 }} /> Retry
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="job-summary-kpi-grid mb-4">
        <div className="kpi-card" onClick={() => setStatusFilter('ALL')}>
          <div className="kpi-icon-box total">
            <Layers size={20} />
          </div>
          <div>
            <div className="kpi-value">{kpis.total}</div>
            <div className="kpi-label">Total Jobs</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setStatusFilter('ACTIVE')}>
          <div className="kpi-icon-box active">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="kpi-value">{kpis.active}</div>
            <div className="kpi-label">Active Listings</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setStatusFilter('DRAFT')}>
          <div className="kpi-icon-box draft">
            <FileText size={20} />
          </div>
          <div>
            <div className="kpi-value">{kpis.draft}</div>
            <div className="kpi-label">Draft Requisitions</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setStatusFilter('CLOSED')}>
          <div className="kpi-icon-box closed">
            <XCircle size={20} />
          </div>
          <div>
            <div className="kpi-value">{kpis.closed}</div>
            <div className="kpi-label">Closed Jobs</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="jobs-controls-card card mb-4">
        <div className="card-body controls-body">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by job title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="clear-search-btn">
                Clear
              </button>
            )}
          </div>

          <div className="filter-sort-group">
            <div className="status-filter-pills">
              {['ALL', 'ACTIVE', 'DRAFT', 'CLOSED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="sort-dropdown-wrapper">
              <ArrowUpDown size={14} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="APPLICANTS">Most Applicants</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Loading State, Table / Cards, or Empty State */}
      {loading ? (
        <div className="card text-center p-5">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Loading jobs from Job Service...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card empty-jobs-card text-center p-5">
          <div className="empty-icon-wrapper blue mb-3">
            <Briefcase size={36} />
          </div>
          <h2>No jobs posted yet</h2>
          <p className="text-muted max-w-md mx-auto mb-4">
            Create your first job posting to start receiving applications from top candidates.
          </p>
          <Link to="/recruiter/jobs/create" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Post New Job</span>
          </Link>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="card empty-jobs-card text-center p-5">
          <div className="empty-icon-wrapper gray mb-3">
            <Search size={32} />
          </div>
          <h3>No matching job requisitions found</h3>
          <p className="text-muted mb-4">
            Try adjusting your search query or status filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
            }}
            className="btn btn-outline btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="desktop-jobs-table-card card">
            <div className="table-responsive">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Job Title & Location</th>
                    <th>Type / Mode</th>
                    <th>Applicants</th>
                    <th>Posted Date</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div className="table-job-info">
                          <Link to={`/recruiter/jobs/${job.id}`} className="job-table-title">
                            {job.title}
                          </Link>
                          <div className="job-table-sub">
                            <MapPin size={12} style={{ marginRight: 4 }} />
                            {job.location} &bull; {job.company}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="type-badge-text">
                          {job.employmentType} ({job.workMode || 'Hybrid'})
                        </span>
                      </td>

                      <td>
                        <div className="applicants-count-badge">
                          <Users size={14} style={{ marginRight: 4 }} />
                          <strong>{job.applicants || 0}</strong> candidates
                        </div>
                      </td>

                      <td>
                        <span className="date-text">{job.postedDate || '-'}</span>
                      </td>

                      <td>
                        <span className="date-text">{job.deadline || 'Open'}</span>
                      </td>

                      <td>{renderStatusBadge(job.status)}</td>

                      <td>
                        <div className="table-actions-cell">
                          <Link
                            to={`/recruiter/jobs/${job.id}`}
                            className="btn-icon-action"
                            title="View Job Details"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            to={`/recruiter/jobs/edit/${job.id}`}
                            className="btn-icon-action"
                            title="Edit Requisition"
                          >
                            <Edit size={16} />
                          </Link>

                          <button
                            onClick={() => promptToggleStatus(job)}
                            className="btn-icon-action"
                            title={job.status === 'CLOSED' ? 'Reopen Job' : 'Close Job'}
                          >
                            {job.status === 'CLOSED' ? <CheckCircle2 size={16} /> : <PowerOff size={16} />}
                          </button>

                          <button
                            onClick={() => promptDelete(job)}
                            className="btn-icon-action danger"
                            title="Delete Requisition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-jobs-cards-list">
            {filteredJobs.map((job) => (
              <div key={job.id} className="mobile-job-card card mb-3">
                <div className="card-body">
                  <div className="flex-between mb-2">
                    {renderStatusBadge(job.status)}
                    <span className="mobile-date">{job.postedDate}</span>
                  </div>

                  <h3 className="mobile-job-title">
                    <Link to={`/recruiter/jobs/${job.id}`}>{job.title}</Link>
                  </h3>
                  <p className="mobile-job-meta">
                    {job.company} &bull; {job.location} ({job.employmentType})
                  </p>

                  <div className="mobile-applicants-row my-2">
                    <Users size={14} style={{ marginRight: 4 }} />
                    <span><strong>{job.applicants || 0}</strong> candidates applied</span>
                  </div>

                  <div className="mobile-card-actions pt-2 mt-2 border-top">
                    <Link to={`/recruiter/jobs/${job.id}`} className="btn btn-outline btn-xs">
                      <Eye size={14} />
                      <span>View</span>
                    </Link>
                    <Link to={`/recruiter/jobs/edit/${job.id}`} className="btn btn-outline btn-xs">
                      <Edit size={14} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => promptToggleStatus(job)}
                      className="btn btn-outline btn-xs"
                    >
                      <PowerOff size={14} />
                      <span>{job.status === 'CLOSED' ? 'Reopen' : 'Close'}</span>
                    </button>
                    <button
                      onClick={() => promptDelete(job)}
                      className="btn btn-danger-outline btn-xs"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmVariant={modalConfig.confirmVariant}
        onConfirm={handleModalConfirm}
        onClose={() => setModalConfig({ isOpen: false, jobId: null, type: null })}
      />
    </div>
  );
};

export default ManageJobs;
