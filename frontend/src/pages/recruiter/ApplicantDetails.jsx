import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import applicationService from '../../services/applicationService';
import ApplicantStatusBadge from '../../components/recruiter/ApplicantStatusBadge';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Award,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'APPLIED', label: 'Applied', color: 'btn-outline' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'btn-warning-outline' },
  { value: 'SHORTLISTED', label: 'Shortlist', color: 'btn-purple-outline' },
  { value: 'SELECTED', label: 'Select Candidate', color: 'btn-success-outline' },
  { value: 'REJECTED', label: 'Reject', color: 'btn-danger-outline' },
];

const ApplicantDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Resume Viewer Modal state
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg('');

    applicationService
      .getApplicantById(id, user)
      .then((data) => {
        if (isMounted) setApplicant(data);
      })
      .catch((err) => {
        if (isMounted) setErrorMsg(err.message || 'Applicant record not found.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await applicationService.updateStatus(id, newStatus, user);
      setApplicant(updated);
      setActionSuccess(`Applicant status updated to ${newStatus.replace('_', ' ')}.`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update applicant status.');
    }
  };

  if (loading) {
    return (
      <div className="card max-w-xl mx-auto my-5 p-5 text-center">
        <div className="spinner mx-auto mb-3" />
        <p className="text-muted">Loading candidate profile...</p>
      </div>
    );
  }

  if (errorMsg || !applicant) {
    return (
      <div className="card empty-state-card max-w-xl mx-auto my-5 p-4 text-center">
        <div className="empty-icon-box danger mb-3">
          <AlertCircle size={32} />
        </div>
        <h2>Applicant Not Found</h2>
        <p className="text-muted mb-4">{errorMsg || 'The requested applicant record does not exist.'}</p>
        <Link to="/recruiter/applicants" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Applicants</span>
        </Link>
      </div>
    );
  }

  const candidate = applicant.candidate || {};
  const initials = (candidate.fullName || 'C')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="applicant-details-page max-w-5xl mx-auto">
      {/* Back Navigation Link */}
      <div className="mb-3">
        <Link to="/recruiter/applicants" className="link-back-btn">
          <ArrowLeft size={16} />
          <span>Back to Applicants</span>
        </Link>
      </div>

      {/* Success Notice Alert */}
      {actionSuccess && (
        <div className="alert alert-success mb-3 flex-align-center gap-2">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="card applicant-header-card mb-4">
        <div className="card-body">
          <div className="applicant-header-main">
            <div className="applicant-profile-identity">
              <div className="applicant-detail-avatar">{initials}</div>
              <div className="applicant-identity-info">
                <div className="title-and-status mb-1">
                  <h1 className="job-detail-title">{candidate.fullName}</h1>
                  <ApplicantStatusBadge status={applicant.status} />
                </div>
                <p className="applied-for-subtitle">
                  Applied for <strong className="text-indigo">{applicant.jobTitle}</strong> &bull; {applicant.appliedDate}
                </p>
                <div className="profile-meta-row mt-2">
                  <span className="meta-item">
                    <Mail size={14} />
                    {candidate.email}
                  </span>
                  <span className="meta-item">
                    <Phone size={14} />
                    {candidate.phone || 'Not specified'}
                  </span>
                  <span className="meta-item">
                    <MapPin size={14} />
                    {candidate.location || 'Location Not Specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Update Quick Action Bar */}
            <div className="status-update-action-box">
              <span className="action-box-label">Update Application Status:</span>
              <div className="status-button-group">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatusChange(opt.value)}
                    className={`btn btn-xs ${
                      applicant.status === opt.value ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left (Profile & Resume) / Right (Experience & Education) */}
      <div className="job-details-sections-grid">
        {/* Left Column */}
        <div className="left-details-column">
          {/* Summary */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title text-md">Professional Summary</h2>
            </div>
            <div className="card-body">
              <p className="job-description-paragraph">{candidate.summary || 'No summary provided.'}</p>
            </div>
          </div>

          {/* Skills Pill Cloud */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title text-md">Technical Skills & Competencies</h2>
            </div>
            <div className="card-body">
              {candidate.skills && candidate.skills.length > 0 ? (
                <div className="skills-pill-cloud">
                  {candidate.skills.map((sk, idx) => (
                    <span key={idx} className="skill-pill">
                      {sk}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No skills listed.</p>
              )}
            </div>
          </div>

          {/* Resume Card */}
          <div className="card mb-4 resume-card-box">
            <div className="card-header">
              <h2 className="card-title text-md flex-align-center gap-2">
                <FileText size={18} />
                <span>Resume & Attachments</span>
              </h2>
            </div>
            <div className="card-body">
              <div className="resume-meta-box">
                <div className="resume-file-icon">
                  <FileText size={24} />
                </div>
                <div className="resume-file-info">
                  <span className="resume-filename">
                    {applicant.resume?.fileName || `${candidate.fullName}_Resume.pdf`}
                  </span>
                  <span className="resume-sub">
                    {applicant.resume?.fileSize || '1.2 MB'} &bull; Uploaded {applicant.appliedDate}
                  </span>
                </div>
              </div>

              <div className="resume-action-buttons mt-3">
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="btn btn-outline btn-sm"
                >
                  <Eye size={16} />
                  <span>View Resume</span>
                </button>
                <button
                  onClick={() => alert(`Downloading ${applicant.resume?.fileName}...`)}
                  className="btn btn-primary btn-sm"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Work Experience & Education */}
        <div className="right-details-column">
          {/* Work Experience Timeline */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title text-md flex-align-center gap-2">
                <Briefcase size={18} />
                <span>Work Experience</span>
              </h2>
            </div>
            <div className="card-body">
              {candidate.experience && candidate.experience.length > 0 ? (
                <div className="candidate-experience-timeline">
                  {candidate.experience.map((exp) => (
                    <div key={exp.id} className="timeline-exp-item mb-3">
                      <h3 className="exp-job-title">{exp.title}</h3>
                      <p className="exp-company">{exp.company} &bull; <span className="exp-period">{exp.period}</span></p>
                      {exp.description && <p className="exp-description">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No work experience listed.</p>
              )}
            </div>
          </div>

          {/* Education History */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title text-md flex-align-center gap-2">
                <GraduationCap size={18} />
                <span>Education & Certifications</span>
              </h2>
            </div>
            <div className="card-body">
              {candidate.education && candidate.education.length > 0 ? (
                <div className="candidate-education-list">
                  {candidate.education.map((edu) => (
                    <div key={edu.id} className="edu-item mb-3">
                      <h3 className="edu-degree">{edu.degree}</h3>
                      <p className="edu-institution">{edu.institution} ({edu.year})</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No education history listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Viewer Preview Modal */}
      {showResumeModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowResumeModal(false)}>
          <div
            className="modal-dialog-card resume-preview-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header border-bottom pb-2">
              <h3 className="modal-title">
                Resume Preview: {applicant.resume?.fileName || candidate.fullName}
              </h3>
              <button
                onClick={() => setShowResumeModal(false)}
                className="modal-close-btn"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="modal-body p-4 text-center">
              <div className="resume-mock-paper card p-4">
                <h2>{candidate.fullName}</h2>
                <p className="text-muted">{candidate.email} &bull; {candidate.phone} &bull; {candidate.location}</p>
                <hr className="my-3" />
                <h4>Summary</h4>
                <p className="text-sm">{candidate.summary}</p>
                <h4 className="mt-3">Skills</h4>
                <p className="text-sm">{(candidate.skills || []).join(', ')}</p>
                <h4 className="mt-3">Work Experience</h4>
                {(candidate.experience || []).map((exp) => (
                  <div key={exp.id} className="text-left text-xs my-2">
                    <strong>{exp.title}</strong> at {exp.company} ({exp.period})
                    <p>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer border-top pt-2">
              <button
                onClick={() => setShowResumeModal(false)}
                className="btn btn-outline"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDetails;
