import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJobById } from '../../data/jobs';
import { addApplication, hasUserApplied, getApplications } from '../../data/applications';
import JobStatusBadge from '../../components/job/JobStatusBadge';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  Upload,
  Send,
  CheckCircle2,
  X,
  Share2,
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job] = useState(() => getJobById(id));
  const [alreadyApplied, setAlreadyApplied] = useState(() => (id ? hasUserApplied(id) : false));
  const [existingAppStatus, setExistingAppStatus] = useState(() => {
    if (!id) return null;
    const apps = getApplications();
    const myApp = apps.find((a) => a.jobId === id);
    return myApp ? myApp.status : null;
  });

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverNotes, setCoverNotes] = useState('');
  const [resumeName, setResumeName] = useState('My_Updated_Resume_2026.pdf');
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!job) return;

    setSubmitting(true);
    setTimeout(() => {
      const newApp = addApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        employmentType: job.employmentType,
        resumeName: resumeName,
        notes: coverNotes || 'Standard application submitted via TalentPulse portal.',
      });

      setSubmitting(false);
      setAlreadyApplied(true);
      setExistingAppStatus(newApp.status);
      setApplicationSuccess(true);
      setShowApplyModal(false);
    }, 600);
  };

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="no-results-card">
          <h2>Job Not Found</h2>
          <p>The position you are looking for may have been closed or removed.</p>
          <Link to="/jobs" className="btn btn-primary mt-3">
            Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      {/* Navigation Header */}
      <div className="details-top-bar">
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
          <ArrowLeft size={16} style={{ marginRight: 6 }} />
          Back to Jobs
        </button>

        <div className="top-bar-actions">
          <button
            onClick={() => alert('Job link copied to clipboard!')}
            className="btn btn-outline btn-sm"
            title="Share Job"
          >
            <Share2 size={16} />
            <span className="hide-mobile">Share</span>
          </button>
        </div>
      </div>

      {applicationSuccess && (
        <div className="alert alert-success-banner mb-4">
          <div className="alert-content">
            <CheckCircle2 size={20} className="alert-icon" />
            <div>
              <strong>Application Submitted Successfully!</strong>
              <p>
                Your application for <strong>{job.title}</strong> at {job.company} has been received.
              </p>
            </div>
          </div>
          <Link to="/job-seeker/applications" className="btn btn-sm btn-primary">
            View My Applications
          </Link>
        </div>
      )}

      {/* Main Job Details Header Card */}
      <div className="details-header-card">
        <div className="dh-company-logo">
          <Building2 size={36} />
        </div>
        <div className="dh-main">
          <div className="dh-title-row">
            <h1 className="dh-job-title">{job.title}</h1>
            <span className="employment-badge">{job.employmentType}</span>
          </div>

          <p className="dh-company-name">{job.company}</p>

          <div className="dh-meta-grid">
            <div className="dh-meta-item">
              <MapPin size={16} />
              <span>
                {job.location} {job.isRemote ? '(Remote)' : ''}
              </span>
            </div>
            <div className="dh-meta-item">
              <Briefcase size={16} />
              <span>{job.experienceLevel} Experience</span>
            </div>
            {job.salaryRange && (
              <div className="dh-meta-item">
                <DollarSign size={16} />
                <span>{job.salaryRange}</span>
              </div>
            )}
            <div className="dh-meta-item">
              <Calendar size={16} />
              <span>Posted: {job.postedDate}</span>
            </div>
            <div className="dh-meta-item">
              <Clock size={16} />
              <span>Deadline: {job.deadline}</span>
            </div>
          </div>
        </div>

        {/* Apply Action Sidebar Widget */}
        <div className="dh-apply-widget">
          {alreadyApplied ? (
            <div className="already-applied-box">
              <CheckCircle size={22} className="applied-check-icon" />
              <div className="applied-box-text">
                <span className="applied-label">Application Status:</span>
                <JobStatusBadge status={existingAppStatus} />
              </div>
              <Link to="/job-seeker/applications" className="btn btn-outline btn-block btn-sm mt-2">
                Manage Applications
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn btn-primary btn-block btn-lg apply-now-btn"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Job Details Content Sections */}
      <div className="details-content-grid">
        {/* Main Column */}
        <div className="details-main-body">
          {/* Job Overview */}
          <section className="details-section">
            <h2>About The Role</h2>
            <p className="section-paragraph">{job.description}</p>
          </section>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="details-section">
              <h2>Key Responsibilities</h2>
              <ul className="details-list">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>
                    <span className="list-bullet">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Qualifications & Requirements */}
          {job.qualifications && job.qualifications.length > 0 && (
            <section className="details-section">
              <h2>Qualifications & Requirements</h2>
              <ul className="details-list">
                {job.qualifications.map((item, index) => (
                  <li key={index}>
                    <span className="list-bullet">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="details-side-bar">
          {/* Required Skills Widget */}
          <div className="side-widget">
            <h3>Required Skills</h3>
            <div className="skills-cloud">
              {job.skills?.map((skill, index) => (
                <span key={index} className="skill-cloud-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Company Overview Widget */}
          <div className="side-widget">
            <h3>About {job.company}</h3>
            <p className="company-desc-text">
              {job.company} is a leading technology enterprise committed to innovation, scale, and modern engineering practices.
            </p>
            <div className="company-meta-list">
              <div className="cm-item">
                <span className="cm-label">Department:</span>
                <span className="cm-val">{job.department}</span>
              </div>
              <div className="cm-item">
                <span className="cm-label">Workplace:</span>
                <span className="cm-val">{job.isRemote ? 'Remote / Hybrid' : 'On-Site'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Entry Point Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Apply for {job.title}</h2>
                <p className="modal-subtitle">{job.company} • {job.location}</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="modal-body">
              <div className="form-group mb-3">
                <label>Resume / CV</label>
                <div className="resume-upload-box">
                  <Upload size={24} className="upload-icon" />
                  <div className="upload-text">
                    <strong>{resumeName}</strong>
                    <span>Uploaded from profile • Mock storage</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setResumeName(`Resume_${Date.now().toString().slice(-4)}.pdf`)
                    }
                    className="btn btn-outline btn-sm"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="form-group mb-4">
                <label htmlFor="coverNotes">Cover Note / Remarks (Optional)</label>
                <textarea
                  id="coverNotes"
                  rows={4}
                  value={coverNotes}
                  onChange={(e) => setCoverNotes(e.target.value)}
                  placeholder="Introduce yourself or highlight why you are a great fit for this position..."
                  className="form-textarea"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? (
                    'Submitting...'
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
      )}
    </div>
  );
};

export default JobDetails;
