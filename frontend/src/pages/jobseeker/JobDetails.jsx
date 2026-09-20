import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getJobById } from '../../data/jobs';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import ApplicationStatusBadge from '../../components/application/ApplicationStatusBadge';
import ApplicationForm from '../../components/application/ApplicationForm';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  CheckCircle2,
  Share2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(() => getJobById(id));
  const [existingApp, setExistingApp] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Sync job from Job Service / Gateway
  useEffect(() => {
    let isMounted = true;
    if (id) {
      jobService.getJobById(id, user).then((res) => {
        if (isMounted && res) {
          setJob(res);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [id, user]);

  // Sync application state on load and user switch
  useEffect(() => {
    let isMounted = true;
    if (id) {
      applicationService.getApplicationByJobId(id, user).then((app) => {
        if (isMounted) {
          if (app) {
            setExistingApp(app);
            setAlreadyApplied(true);
          } else {
            setExistingApp(null);
            setAlreadyApplied(false);
          }
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const handleApplicationSuccess = (createdApp) => {
    setExistingApp(createdApp);
    setAlreadyApplied(true);
    setApplicationSuccess(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
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
          {shareSuccess && (
            <span className="share-feedback text-emerald text-xs flex-align-center">
              <CheckCircle2 size={14} style={{ marginRight: 4 }} />
              Link Copied!
            </span>
          )}
          <button
            onClick={handleShare}
            className="btn btn-outline btn-sm"
            title="Share Job"
          >
            <Share2 size={16} />
            <span className="hide-mobile">Share</span>
          </button>
        </div>
      </div>

      {/* Application Success Banner */}
      {applicationSuccess && (
        <div className="alert alert-success-banner mb-4">
          <div className="alert-content">
            <CheckCircle2 size={22} className="alert-icon" />
            <div>
              <strong>Application Submitted Successfully!</strong>
              <p>
                Your candidate profile and resume have been submitted for <strong>{job.title}</strong> at {job.company}.
              </p>
            </div>
          </div>
          <div className="alert-actions flex-align-center gap-2">
            {existingApp && (
              <Link
                to={`/job-seeker/applications/${existingApp.id}`}
                className="btn btn-sm btn-primary"
              >
                <span>View Application Details</span>
                <ChevronRight size={14} style={{ marginLeft: 4 }} />
              </Link>
            )}
            <Link to="/job-seeker/applications" className="btn btn-sm btn-outline">
              My Applications
            </Link>
          </div>
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
                <ApplicationStatusBadge status={existingApp?.status || 'APPLIED'} />
              </div>
              {existingApp ? (
                <Link
                  to={`/job-seeker/applications/${existingApp.id}`}
                  className="btn btn-primary btn-block btn-sm mt-2 flex-align-center justify-center gap-1"
                >
                  <span>View Application</span>
                  <ChevronRight size={14} />
                </Link>
              ) : (
                <Link
                  to="/job-seeker/applications"
                  className="btn btn-outline btn-block btn-sm mt-2"
                >
                  Manage Applications
                </Link>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn btn-primary btn-block btn-lg apply-now-btn"
            >
              <Sparkles size={18} style={{ marginRight: 6 }} />
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

      {/* Application Form Modal Component */}
      <ApplicationForm
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
};

export default JobDetails;
