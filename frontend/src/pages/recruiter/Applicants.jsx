import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import applicationService from '../../services/applicationService';
import jobService from '../../services/jobService';
import ApplicantStatusBadge from '../../components/recruiter/ApplicantStatusBadge';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Briefcase,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Clock,
  MapPin,
  Layers,
  Award,
} from 'lucide-react';

const Applicants = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdFromQuery = searchParams.get('jobId') || 'ALL';

  const [applicants, setApplicants] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState(jobIdFromQuery);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      applicationService.getRecruiterApplicants(user),
      jobService.getRecruiterJobs(user),
    ])
      .then(([appData, jobData]) => {
        if (isMounted) {
          setApplicants(appData);
          setRecruiterJobs(jobData);
        }
      })
      .catch((err) => {
        console.warn('Error fetching applicants:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Keep query param in sync with state if changed
  const handleJobSelectChange = (e) => {
    const val = e.target.value;
    setSelectedJobId(val);
    if (val !== 'ALL') {
      setSearchParams({ jobId: val });
    } else {
      setSearchParams({});
    }
  };

  // Compute Dynamic Summary Statistics
  const stats = useMemo(() => {
    const total = applicants.length;
    const newApplied = applicants.filter((a) => a.status === 'APPLIED').length;
    const underReview = applicants.filter((a) => a.status === 'UNDER_REVIEW').length;
    const shortlisted = applicants.filter((a) => a.status === 'SHORTLISTED').length;
    const selected = applicants.filter((a) => a.status === 'SELECTED').length;
    const rejected = applicants.filter((a) => a.status === 'REJECTED').length;
    return { total, newApplied, underReview, shortlisted, selected, rejected };
  }, [applicants]);

  // Search & Filter Pipeline
  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      // Filter by Selected Job Requisition
      if (selectedJobId !== 'ALL' && app.jobId !== selectedJobId) {
        return false;
      }
      // Filter by Status Tab
      if (statusFilter !== 'ALL' && app.status !== statusFilter) {
        return false;
      }
      // Search Query (Candidate Name, Email, Skills, Job Title)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const candName = app.candidate?.fullName?.toLowerCase() || '';
        const candEmail = app.candidate?.email?.toLowerCase() || '';
        const jobTitle = app.jobTitle?.toLowerCase() || '';
        const skills = Array.isArray(app.candidate?.skills)
          ? app.candidate.skills.join(' ').toLowerCase()
          : '';

        if (
          !candName.includes(query) &&
          !candEmail.includes(query) &&
          !jobTitle.includes(query) &&
          !skills.includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [applicants, selectedJobId, statusFilter, searchTerm]);

  return (
    <div className="applicants-page">
      {/* Page Header */}
      <div className="page-header-row mb-4">
        <div>
          <h1 className="page-title">Applicants</h1>
          <p className="page-subtitle">
            Review and manage candidates who applied to your jobs.
          </p>
        </div>
      </div>

      {/* KPI Summary Statistics */}
      <div className="applicant-summary-grid mb-4">
        <div className="kpi-card" onClick={() => setStatusFilter('ALL')}>
          <div className="kpi-icon-box total">
            <Users size={20} />
          </div>
          <div>
            <div className="kpi-value">{stats.total}</div>
            <div className="kpi-label">Total Applicants</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setStatusFilter('APPLIED')}>
          <div className="kpi-icon-box active">
            <FileText size={20} />
          </div>
          <div>
            <div className="kpi-value">{stats.newApplied}</div>
            <div className="kpi-label">New Applied</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setStatusFilter('UNDER_REVIEW')}>
          <div className="kpi-icon-box draft">
            <Clock size={20} />
          </div>
          <div>
            <div className="kpi-value">{stats.underReview}</div>
            <div className="kpi-label">Under Review</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setStatusFilter('SHORTLISTED')}>
          <div className="kpi-icon-box total">
            <UserCheck size={20} />
          </div>
          <div>
            <div className="kpi-value">{stats.shortlisted}</div>
            <div className="kpi-label">Shortlisted</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setStatusFilter('SELECTED')}>
          <div className="kpi-icon-box active">
            <Award size={20} />
          </div>
          <div>
            <div className="kpi-value">{stats.selected}</div>
            <div className="kpi-label">Selected</div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Job Filter & Status Tabs */}
      <div className="card controls-card mb-4">
        <div className="card-body controls-body">
          <div className="flex-gap-md flex-1 flex-wrap">
            {/* Search Bar */}
            <div className="search-input-wrapper flex-1">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by candidate name, email, skills, or job..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="clear-search-btn">
                  Clear
                </button>
              )}
            </div>

            {/* Job Requisition Filter Dropdown */}
            <div className="job-filter-select-wrapper">
              <Briefcase size={16} className="select-icon" />
              <select
                value={selectedJobId}
                onChange={handleJobSelectChange}
                className="job-filter-select"
              >
                <option value="ALL">All Jobs ({applicants.length})</option>
                {recruiterJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="status-filter-pills mt-2-mobile">
            {['ALL', 'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                >
                  {st.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="card text-center p-5">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Loading applicants...</p>
        </div>
      ) : applicants.length === 0 ? (
        <div className="card empty-jobs-card text-center p-5">
          <div className="empty-icon-wrapper blue mb-3">
            <Users size={36} />
          </div>
          <h2>No applicants yet</h2>
          <p className="text-muted max-w-md mx-auto mb-4">
            No candidates have applied to your active job postings yet.
          </p>
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="card empty-jobs-card text-center p-5">
          <div className="empty-icon-wrapper gray mb-3">
            <Search size={32} />
          </div>
          <h3>No applicants match your search</h3>
          <p className="text-muted mb-4">
            Try resetting your search query or selecting a different job filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
              setSelectedJobId('ALL');
              setSearchParams({});
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
              <table className="jobs-table applicants-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Applied For</th>
                    <th>Applied Date</th>
                    <th>Experience</th>
                    <th>Key Skills</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((app) => {
                    const initials = (app.candidate?.fullName || 'C')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase();

                    return (
                      <tr key={app.id}>
                        <td>
                          <div className="applicant-user-cell">
                            <div className="applicant-avatar-circle">{initials}</div>
                            <div className="applicant-user-meta">
                              <Link
                                to={`/recruiter/applicants/${app.id}`}
                                className="candidate-name-link"
                              >
                                {app.candidate?.fullName}
                              </Link>
                              <span className="candidate-email-text">
                                {app.candidate?.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="applied-job-title">{app.jobTitle}</span>
                        </td>

                        <td>
                          <span className="date-text">{app.appliedDate}</span>
                        </td>

                        <td>
                          <span className="type-badge-text">{app.experience}</span>
                        </td>

                        <td>
                          <div className="compact-skills-badges">
                            {(app.candidate?.skills || []).slice(0, 3).map((sk, idx) => (
                              <span key={idx} className="compact-skill-badge">
                                {sk}
                              </span>
                            ))}
                            {(app.candidate?.skills || []).length > 3 && (
                              <span className="compact-skill-badge more">
                                +{(app.candidate?.skills || []).length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <ApplicantStatusBadge status={app.status} />
                        </td>

                        <td className="text-right">
                          <Link
                            to={`/recruiter/applicants/${app.id}`}
                            className="btn btn-outline btn-xs"
                          >
                            <Eye size={14} />
                            <span>View Candidate</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="mobile-jobs-cards-list">
            {filteredApplicants.map((app) => {
              const initials = (app.candidate?.fullName || 'C')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();

              return (
                <div key={app.id} className="mobile-applicant-card card mb-3">
                  <div className="card-body">
                    <div className="flex-between mb-2">
                      <ApplicantStatusBadge status={app.status} />
                      <span className="mobile-date">{app.appliedDate}</span>
                    </div>

                    <div className="applicant-user-cell mb-2">
                      <div className="applicant-avatar-circle">{initials}</div>
                      <div>
                        <h3 className="mobile-job-title mb-0">
                          <Link to={`/recruiter/applicants/${app.id}`}>
                            {app.candidate?.fullName}
                          </Link>
                        </h3>
                        <span className="candidate-email-text">{app.candidate?.email}</span>
                      </div>
                    </div>

                    <div className="mobile-job-meta mb-2">
                      <strong>Job:</strong> {app.jobTitle}
                    </div>

                    <div className="mobile-job-meta mb-2">
                      <strong>Experience:</strong> {app.experience}
                    </div>

                    <div className="compact-skills-badges mb-3">
                      {(app.candidate?.skills || []).map((sk, idx) => (
                        <span key={idx} className="compact-skill-badge">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="mobile-card-actions pt-2 border-top">
                      <Link
                        to={`/recruiter/applicants/${app.id}`}
                        className="btn btn-primary btn-sm w-full justify-center"
                      >
                        <Eye size={16} />
                        <span>View Full Candidate Profile</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Applicants;
