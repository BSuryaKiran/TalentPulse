import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import jobService from '../../services/jobService';
import ConfirmationModal from '../../components/recruiter/ConfirmationModal';
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Edit,
  PowerOff,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  ListChecks,
  Send,
} from 'lucide-react';

const getStatusBadge = (status) => {
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

const RecruiterJobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    confirmText: '',
    confirmVariant: 'primary',
  });

  const loadJob = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await jobService.getJobById(id, user);
      setJob(data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load job requisition details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id, user]);

  const promptPublish = () => {
    setModalConfig({
      isOpen: true,
      type: 'PUBLISH',
      title: 'Publish Job Requisition?',
      message: 'Publishing this job will transition its status to ACTIVE and make it visible to job seekers.',
      confirmText: 'Publish Job',
      confirmVariant: 'primary',
    });
  };

  const promptClose = () => {
    setModalConfig({
      isOpen: true,
      type: 'CLOSE',
      title: 'Close Requisition?',
      message: 'Closing this job requisition will prevent new candidate submissions.',
      confirmText: 'Close Job',
      confirmVariant: 'warning',
    });
  };

  const promptDelete = () => {
    setModalConfig({
      isOpen: true,
      type: 'DELETE',
      title: 'Delete Job Requisition?',
      message: 'Are you sure you want to permanently delete this job requisition? This action cannot be undone.',
      confirmText: 'Delete Job',
      confirmVariant: 'danger',
    });
  };

  const handleConfirmAction = async () => {
    const { type } = modalConfig;
    setModalConfig({ isOpen: false, type: null });
    setActionProcessing(true);
    setErrorMsg('');
    setActionSuccess('');

    try {
      if (type === 'PUBLISH') {
        const updated = await jobService.publishJob(id, user);
        if (updated) setJob(updated);
        setActionSuccess('Job published successfully!');
      } else if (type === 'CLOSE') {
        const updated = await jobService.closeJob(id, user);
        if (updated) setJob(updated);
        setActionSuccess('Job closed successfully!');
      } else if (type === 'DELETE') {
        await jobService.deleteJob(id, user);
        navigate('/recruiter/jobs');
        return;
      }
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setActionProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="card max-w-xl mx-auto my-5 p-5 text-center">
        <div className="spinner mx-auto mb-3" />
        <p className="text-muted">Loading job details from Job Service...</p>
      </div>
    );
  }

  if (errorMsg && !job) {
    return (
      <div className="card empty-state-card max-w-xl mx-auto my-5 p-4 text-center">
        <div className="empty-icon-box danger mb-3">
          <AlertCircle size={32} />
        </div>
        <h2>Job Requisition Not Found</h2>
        <p className="text-muted mb-4">{errorMsg}</p>
        <Link to="/recruiter/jobs" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Manage Jobs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="job-details-page max-w-5xl mx-auto">
      {/* Back Link */}
      <div className="mb-3">
        <Link to="/recruiter/jobs" className="link-back-btn">
          <ArrowLeft size={16} />
          <span>Back to Manage Jobs</span>
        </Link>
      </div>

      {/* Success Notice */}
      {actionSuccess && (
        <div className="alert alert-success mb-3 flex-align-center gap-2">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Action Error Alert */}
      {errorMsg && (
        <div className="alert alert-danger mb-3 flex-align-center gap-2">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header Overview Card */}
      <div className="card job-details-header-card mb-4">
        <div className="card-body">
          <div className="header-top-row">
            <div className="title-and-status">
              <h1 className="job-detail-title">{job.title}</h1>
              <div className="status-container">{getStatusBadge(job.status)}</div>
            </div>

            <div className="job-action-buttons">
              <Link
                to={`/recruiter/applicants?jobId=${job.id}`}
                className="btn btn-primary btn-sm"
                title="View Candidates Applied to this Requisition"
              >
                <Users size={16} />
                <span>View Applicants</span>
              </Link>

              {job.status === 'DRAFT' && (
                <button
                  onClick={promptPublish}
                  disabled={actionProcessing}
                  className="btn btn-primary btn-sm"
                >
                  <Send size={16} />
                  <span>Publish</span>
                </button>
              )}

              <Link to={`/recruiter/jobs/edit/${job.id}`} className="btn btn-outline btn-sm">
                <Edit size={16} />
                <span>Edit</span>
              </Link>

              {job.status === 'ACTIVE' && (
                <button
                  onClick={promptClose}
                  disabled={actionProcessing}
                  className="btn btn-warning-outline btn-sm"
                >
                  <PowerOff size={16} />
                  <span>Close</span>
                </button>
              )}

              {job.status === 'CLOSED' && (
                <button
                  onClick={promptPublish}
                  disabled={actionProcessing}
                  className="btn btn-secondary btn-sm"
                >
                  <CheckCircle2 size={16} />
                  <span>Reopen</span>
                </button>
              )}

              <button
                onClick={promptDelete}
                disabled={actionProcessing}
                className="btn btn-danger-outline btn-sm"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="job-company-subtitle">
            <Building2 size={18} className="icon-brand" />
            <strong className="company-text">{job.company}</strong>
          </div>

          {/* Quick Metrics Grid */}
          <div className="job-quick-metrics-grid mt-4">
            <div className="metric-box">
              <MapPin size={16} className="metric-icon" />
              <div>
                <span className="metric-label">Location & Mode</span>
                <span className="metric-val">{job.location} ({job.workMode || 'Hybrid'})</span>
              </div>
            </div>

            <div className="metric-box">
              <Briefcase size={16} className="metric-icon" />
              <div>
                <span className="metric-label">Employment Type</span>
                <span className="metric-val">{job.employmentType}</span>
              </div>
            </div>

            <div className="metric-box">
              <DollarSign size={16} className="metric-icon" />
              <div>
                <span className="metric-label">Salary Range</span>
                <span className="metric-val">{job.salary || 'Competitive'}</span>
              </div>
            </div>

            <div className="metric-box">
              <Users size={16} className="metric-icon" />
              <div>
                <span className="metric-label">Total Applicants</span>
                <span className="metric-val highlight-purple">{job.applicants || 0} candidates</span>
              </div>
            </div>

            <div className="metric-box">
              <Calendar size={16} className="metric-icon" />
              <div>
                <span className="metric-label">Posted Date</span>
                <span className="metric-val">{job.postedDate || 'Recent'}</span>
              </div>
            </div>

            <div className="metric-box">
              <Clock size={16} className="metric-icon" />
              <div>
                <span className="metric-label">Deadline</span>
                <span className="metric-val">{job.deadline || 'Open until filled'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="job-details-sections-grid">
        {/* Left Column */}
        <div className="left-details-column">
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title text-md">Job Overview</h2>
            </div>
            <div className="card-body">
              <p className="job-description-paragraph">{job.description}</p>
            </div>
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="card-title text-md flex-align-center gap-2">
                  <ListChecks size={18} />
                  <span>Key Responsibilities</span>
                </h2>
              </div>
              <div className="card-body">
                <ul className="custom-check-list">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {job.qualifications && job.qualifications.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="card-title text-md">Qualifications & Requirements</h2>
              </div>
              <div className="card-body">
                <ul className="custom-check-list">
                  {job.qualifications.map((qual, idx) => (
                    <li key={idx}>{qual}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="right-details-column">
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title text-md">Required Skills</h2>
            </div>
            <div className="card-body">
              {job.skills && job.skills.length > 0 ? (
                <div className="skills-pill-cloud">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No skill tags attached.</p>
              )}
            </div>
          </div>

          {job.benefits && job.benefits.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="card-title text-md flex-align-center gap-2">
                  <Sparkles size={18} />
                  <span>Perks & Benefits</span>
                </h2>
              </div>
              <div className="card-body">
                <ul className="benefits-list">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmVariant={modalConfig.confirmVariant}
        onConfirm={handleConfirmAction}
        onClose={() => setModalConfig({ isOpen: false, type: null })}
      />
    </div>
  );
};

export default RecruiterJobDetails;
