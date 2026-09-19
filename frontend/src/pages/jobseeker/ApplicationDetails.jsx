import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import applicationService from '../../services/applicationService';
import ApplicationStatusBadge from '../../components/application/ApplicationStatusBadge';
import ApplicationTimeline from '../../components/application/ApplicationTimeline';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  Eye,
  Download,
  ExternalLink,
  User,
  Mail,
  AlertCircle,
  XCircle,
  Layers,
} from 'lucide-react';

const ApplicationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    applicationService
      .getApplicationById(id, user)
      .then((data) => {
        if (isMounted) {
          setApplication(data);
          setErrorMsg('');
        }
      })
      .catch((err) => {
        if (isMounted) setErrorMsg(err.message || 'Application record was not found.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  if (loading) {
    return (
      <div className="application-details-page">
        <div className="card max-w-xl mx-auto my-5 p-5 text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !application) {
    return (
      <div className="application-details-page">
        <div className="no-results-card max-w-xl mx-auto my-5 p-4 text-center">
          <div className="no-results-icon danger mb-3">
            <AlertCircle size={36} />
          </div>
          <h2>Application Not Found</h2>
          <p className="text-muted mb-4">
            {errorMsg || 'The requested application record could not be found or you do not have permission to view it.'}
          </p>
          <Link to="/job-seeker/applications" className="btn btn-primary">
            <ArrowLeft size={16} style={{ marginRight: 6 }} />
            Back to My Applications
          </Link>
        </div>
      </div>
    );
  }

  const resume = application.resume || {
    fileName: application.resumeName || 'Candidate_Resume.pdf',
    fileSize: '1.2 MB',
    lastUploaded: application.appliedDate,
  };

  return (
    <div className="application-details-page">
      {/* Back Navigation Bar */}
      <div className="details-top-bar">
        <Link to="/job-seeker/applications" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} style={{ marginRight: 6 }} />
          Back to My Applications
        </Link>

        <div className="top-bar-actions">
          <Link
            to={`/jobs/${application.jobId}`}
            className="btn btn-outline btn-sm"
            title="View Job Requisition"
          >
            <span>View Job Posting</span>
            <ExternalLink size={14} style={{ marginLeft: 6 }} />
          </Link>
        </div>
      </div>

      {/* Main Application Header Card */}
      <div className="details-header-card application-header-card">
        <div className="dh-company-logo">
          <Building2 size={36} />
        </div>

        <div className="dh-main">
          <div className="dh-title-row">
            <h1 className="dh-job-title">{application.jobTitle}</h1>
            <ApplicationStatusBadge status={application.status} />
          </div>

          <p className="dh-company-name">{application.companyName || application.company}</p>

          <div className="dh-meta-grid">
            <div className="dh-meta-item">
              <MapPin size={16} />
              <span>{application.location || 'Remote'}</span>
            </div>
            <div className="dh-meta-item">
              <Briefcase size={16} />
              <span>{application.employmentType || 'Full Time'}</span>
            </div>
            <div className="dh-meta-item">
              <Calendar size={16} />
              <span>Applied on: {application.appliedDate}</span>
            </div>
            <div className="dh-meta-item">
              <Clock size={16} />
              <span>Last Updated: {application.lastUpdated || application.appliedDate}</span>
            </div>
          </div>
        </div>

        {/* Action Summary Widget */}
        <div className="dh-apply-widget">
          <div className="app-status-box">
            <span className="asb-label">Application Reference:</span>
            <span className="asb-id">#{application.id}</span>
            <Link
              to={`/jobs/${application.jobId}`}
              className="btn btn-outline btn-sm btn-block mt-3"
            >
              <ExternalLink size={14} style={{ marginRight: 6 }} />
              Original Job Post
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Job & App Info) / Right (Application Timeline) */}
      <div className="application-details-grid">
        {/* Left Column: Job & Submission Information */}
        <div className="app-details-left-col">
          {/* Job Information Section */}
          <div className="card app-info-card mb-4">
            <div className="card-header flex-align-center gap-2">
              <Briefcase size={18} className="text-indigo" />
              <h2 className="card-title text-md">Job Requisition Overview</h2>
            </div>
            <div className="card-body">
              <div className="info-key-value-grid">
                <div className="ikv-item">
                  <span className="ikv-label">Company:</span>
                  <span className="ikv-value">{application.companyName || application.company}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Workplace Location:</span>
                  <span className="ikv-value">{application.location || 'Remote'}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Employment Type:</span>
                  <span className="ikv-value">{application.employmentType || 'Full Time'}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Work Mode:</span>
                  <span className="ikv-value">{application.workMode || 'Hybrid'}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Experience Required:</span>
                  <span className="ikv-value">{application.experience || 'Not Specified'}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Compensation:</span>
                  <span className="ikv-value">{application.salary || 'Competitive'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Application Information Section */}
          <div className="card app-info-card mb-4">
            <div className="card-header flex-align-center gap-2">
              <User size={18} className="text-indigo" />
              <h2 className="card-title text-md">Application Submission Data</h2>
            </div>
            <div className="card-body">
              <div className="candidate-summary-bar mb-3">
                <div className="csb-avatar">
                  {(application.candidateName || user?.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="csb-text">
                  <strong className="csb-name">
                    {application.candidateName || user?.name || 'Candidate'}
                  </strong>
                  <span className="csb-email">
                    <Mail size={12} style={{ marginRight: 4 }} />
                    {application.candidateEmail || user?.email}
                  </span>
                </div>
              </div>

              {/* Cover Letter / Notes */}
              <div className="submitted-notes-section mb-3">
                <label className="section-mini-label">Cover Note / Remarks Submitted:</label>
                <div className="submitted-notes-box">
                  <p>
                    {application.coverLetter ||
                      application.notes ||
                      'No specific cover remarks attached with this application.'}
                  </p>
                </div>
              </div>

              {/* Resume Used Box */}
              <div className="resume-attached-box">
                <div className="rab-icon">
                  <FileText size={24} />
                </div>
                <div className="rab-info">
                  <strong className="rab-filename">{resume.fileName}</strong>
                  <span className="rab-meta">
                    {resume.fileSize || '1.2 MB'} &bull; Submitted on {application.appliedDate}
                  </span>
                </div>
                <div className="rab-actions">
                  <button
                    onClick={() => setShowResumeModal(true)}
                    className="btn btn-outline btn-xs"
                    title="View Resume Preview"
                  >
                    <Eye size={13} style={{ marginRight: 4 }} />
                    Preview
                  </button>
                  <button
                    onClick={() => alert(`Downloading resume: ${resume.fileName}...`)}
                    className="btn btn-primary btn-xs"
                    title="Download Attached Resume"
                  >
                    <Download size={13} style={{ marginRight: 4 }} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Application Timeline & Status Progression */}
        <div className="app-details-right-col">
          <div className="card timeline-wrapper-card">
            <div className="card-header flex-align-center gap-2">
              <Layers size={18} className="text-indigo" />
              <h2 className="card-title text-md">Application Timeline</h2>
            </div>
            <div className="card-body">
              <ApplicationTimeline
                status={application.status}
                appliedDate={application.appliedDate}
                lastUpdated={application.lastUpdated}
                customTimeline={application.timeline}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview Modal */}
      {showResumeModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowResumeModal(false)}>
          <div
            className="modal-dialog-card resume-preview-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header border-bottom pb-2">
              <div className="flex-align-center gap-2">
                <FileText size={20} className="text-indigo" />
                <h3 className="modal-title">Resume Preview: {resume.fileName}</h3>
              </div>
              <button
                onClick={() => setShowResumeModal(false)}
                className="modal-close-btn"
                aria-label="Close Preview"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="modal-body p-4 text-center">
              <div className="resume-mock-paper card p-4 text-left">
                <h2>{application.candidateName || user?.name || 'Alex Morgan'}</h2>
                <p className="text-muted">
                  {application.candidateEmail || user?.email} &bull; {application.location || 'San Francisco, CA'}
                </p>
                <hr className="my-3" />
                <h4>Application Note</h4>
                <p className="text-sm">
                  {application.coverLetter || application.notes || 'Full profile resume transmitted to enterprise hiring portal.'}
                </p>
                <h4 className="mt-3">Target Requisition</h4>
                <p className="text-sm">
                  Position: <strong>{application.jobTitle}</strong> at <strong>{application.companyName || application.company}</strong>
                </p>
                <h4 className="mt-3">Status</h4>
                <p className="text-sm">
                  Current Status: <strong className="text-indigo">{application.status}</strong> (Applied on {application.appliedDate})
                </p>
              </div>
            </div>
            <div className="modal-footer border-top pt-2">
              <button
                onClick={() => setShowResumeModal(false)}
                className="btn btn-outline"
              >
                Close Preview
              </button>
              <button
                onClick={() => alert(`Downloading resume: ${resume.fileName}...`)}
                className="btn btn-primary"
              >
                <Download size={15} style={{ marginRight: 6 }} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
