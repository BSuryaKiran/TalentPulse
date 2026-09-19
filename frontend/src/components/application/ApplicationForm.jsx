import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { getProfile } from '../../data/profile';
import applicationService from '../../services/applicationService';
import {
  X,
  Send,
  Upload,
  FileText,
  AlertCircle,
  Building2,
  MapPin,
  Briefcase,
  User,
  Mail,
  CheckCircle2,
} from 'lucide-react';

const ApplicationForm = ({ job, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();

  // Prepopulate resume name from user profile
  const [profile] = useState(() => getProfile(user));
  const defaultResumeName =
    profile?.resume?.fileName ||
    `${(user?.name || 'Candidate').replace(/\s+/g, '_')}_Resume_2026.pdf`;

  const [resumeName, setResumeName] = useState(defaultResumeName);
  const [resumeSize] = useState('1.2 MB');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChangingResume, setIsChangingResume] = useState(false);
  const [customResumeInput, setCustomResumeInput] = useState('');

  if (!isOpen || !job) return null;

  const handleCustomResumeSave = () => {
    if (customResumeInput.trim()) {
      let name = customResumeInput.trim();
      if (!name.toLowerCase().endsWith('.pdf') && !name.toLowerCase().endsWith('.docx')) {
        name += '.pdf';
      }
      setResumeName(name);
    }
    setIsChangingResume(false);
    setCustomResumeInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!isAuthenticated || !user) {
      setErrorMessage('You must be logged in to submit an application.');
      return;
    }

    if (!job.id) {
      setErrorMessage('Invalid job requisition selected.');
      return;
    }

    if (!resumeName) {
      setErrorMessage('Please attach a valid resume before submitting.');
      return;
    }

    // Duplicate check
    const alreadyApplied = await applicationService.hasUserApplied(job.id, user);
    if (alreadyApplied) {
      setErrorMessage('You have already applied for this job.');
      return;
    }

    setSubmitting(true);

    try {
      const appPayload = {
        jobId: String(job.id),
        jobTitle: job.title,
        companyName: job.company || job.companyName || 'TalentPulse Enterprise',
        company: job.company || job.companyName || 'TalentPulse Enterprise',
        candidateId: user.id || 'cand-101',
        candidateEmail: user.email,
        candidateName: user.name || profile.fullName || 'Candidate',
        location: job.location || 'Remote',
        employmentType: job.employmentType || 'Full Time',
        workMode: job.workMode || (job.isRemote ? 'Remote' : 'On-Site'),
        experience: job.experienceLevel || job.experience || 'Not Specified',
        salary: job.salaryRange || job.salary || 'Competitive',
        resume: {
          fileName: resumeName,
          fileSize: resumeSize,
          lastUploaded: new Date().toISOString().split('T')[0],
        },
        resumeName: resumeName,
        coverLetter: coverLetter.trim(),
        notes: coverLetter.trim() || 'Application submitted via TalentPulse portal.',
      };

      const createdApplication = await applicationService.createApplication(appPayload, user);

      setSubmitting(false);
      onSuccess(createdApplication);
      onClose();
    } catch (err) {
      setSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card application-form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <h2>Apply for Position</h2>
            <p className="modal-subtitle">
              Submit your candidate profile & resume to <strong>{job.company || job.companyName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close application modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Job Summary Banner */}
        <div className="app-job-summary-box">
          <div className="ajs-header">
            <h3 className="ajs-title">{job.title}</h3>
            <span className="ajs-badge">{job.employmentType || 'Full Time'}</span>
          </div>
          <div className="ajs-meta">
            <span>
              <Building2 size={14} />
              {job.company || job.companyName}
            </span>
            <span>
              <MapPin size={14} />
              {job.location} {job.isRemote ? '(Remote)' : ''}
            </span>
            {job.experienceLevel && (
              <span>
                <Briefcase size={14} />
                {job.experienceLevel}
              </span>
            )}
          </div>
        </div>

        {/* Form Error Banner */}
        {errorMessage && (
          <div className="alert alert-danger mx-4 my-2 flex-align-center gap-2">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Candidate Profile Details (Read-only Confirmation) */}
          <div className="form-section-header">
            <h4>Candidate Details</h4>
          </div>
          <div className="candidate-details-grid">
            <div className="cd-item">
              <span className="cd-label">
                <User size={13} /> Full Name
              </span>
              <span className="cd-value">{user?.name || profile?.fullName || 'Candidate'}</span>
            </div>
            <div className="cd-item">
              <span className="cd-label">
                <Mail size={13} /> Contact Email
              </span>
              <span className="cd-value">{user?.email}</span>
            </div>
          </div>

          {/* Resume Selection */}
          <div className="form-section-header mt-3">
            <h4>Resume / Curriculum Vitae</h4>
          </div>
          <div className="form-group mb-3">
            <div className="resume-upload-box">
              <div className="resume-box-icon">
                <FileText size={28} />
              </div>
              <div className="upload-text">
                <strong>{resumeName}</strong>
                <span>
                  {resumeSize} &bull; Attached from Profile &bull; PDF / DOCX format
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingResume((prev) => !prev)}
                className="btn btn-outline btn-sm"
              >
                <Upload size={14} style={{ marginRight: 4 }} />
                {isChangingResume ? 'Cancel' : 'Change File'}
              </button>
            </div>

            {/* Custom Resume Change Box */}
            {isChangingResume && (
              <div className="custom-resume-input-row mt-2">
                <input
                  type="text"
                  placeholder="Enter resume file name (e.g. John_Doe_Resume_2026.pdf)"
                  value={customResumeInput}
                  onChange={(e) => setCustomResumeInput(e.target.value)}
                  className="form-control form-control-sm"
                />
                <button
                  type="button"
                  onClick={handleCustomResumeSave}
                  className="btn btn-primary btn-sm"
                >
                  Apply File
                </button>
              </div>
            )}
          </div>

          {/* Optional Cover Note */}
          <div className="form-group mb-3">
            <label htmlFor="coverLetterInput" className="form-label-with-hint">
              <span>Cover Note / Remarks</span>
              <span className="optional-tag">Optional</span>
            </label>
            <textarea
              id="coverLetterInput"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Highlight relevant experience, achievements, or why you are a great fit for this role..."
              className="form-textarea"
            />
          </div>

          {/* Application Agreement Note */}
          <div className="submission-notice-box">
            <CheckCircle2 size={16} className="notice-icon" />
            <p>
              By submitting, your candidate profile and attached resume will be transmitted to the hiring team for review.
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? (
                'Submitting Application...'
              ) : (
                <>
                  <Send size={16} style={{ marginRight: 6 }} />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
