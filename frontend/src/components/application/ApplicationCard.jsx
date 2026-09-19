import { Link } from 'react-router-dom';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { Building2, Calendar, MapPin, Briefcase, ChevronRight, ExternalLink } from 'lucide-react';

const ApplicationCard = ({ application }) => {
  if (!application) return null;

  return (
    <div className="application-item-card">
      <div className="aic-main-row">
        <div className="aic-company-logo">
          <Building2 size={24} />
        </div>

        <div className="aic-info">
          <div className="aic-title-row">
            <Link
              to={`/job-seeker/applications/${application.id}`}
              className="aic-job-title"
            >
              {application.jobTitle}
            </Link>
            <ApplicationStatusBadge status={application.status} />
          </div>

          <p className="aic-company">{application.companyName || application.company}</p>

          <div className="aic-meta-chips">
            <span className="meta-chip">
              <MapPin size={13} />
              {application.location || 'Remote'}
            </span>
            <span className="meta-chip">
              <Briefcase size={13} />
              {application.employmentType || 'Full Time'}
            </span>
            <span className="meta-chip">
              <Calendar size={13} />
              Applied: {application.appliedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="aic-footer-actions">
        <Link
          to={`/jobs/${application.jobId}`}
          className="btn btn-outline btn-xs"
          title="View Original Job Requisition"
        >
          <span>Job Details</span>
          <ExternalLink size={12} />
        </Link>
        <Link
          to={`/job-seeker/applications/${application.id}`}
          className="btn btn-primary btn-xs"
        >
          <span>View Application</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ApplicationCard;
