import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, ChevronRight, Building2, DollarSign } from 'lucide-react';

const JobCard = ({ job }) => {
  if (!job) return null;

  const {
    id,
    title,
    company,
    location,
    isRemote,
    employmentType,
    experienceLevel,
    salaryRange,
    skills = [],
    postedDate,
    description,
  } = job;

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-logo-placeholder">
          <Building2 size={24} className="company-icon" />
        </div>
        <div className="job-header-info">
          <h3 className="job-card-title">{title}</h3>
          <p className="job-card-company">{company}</p>
        </div>
      </div>

      <div className="job-card-meta">
        <span className="meta-item">
          <MapPin size={14} />
          {location} {isRemote && <span className="remote-tag">(Remote)</span>}
        </span>
        <span className="meta-item">
          <Briefcase size={14} />
          {employmentType}
        </span>
        <span className="meta-item">
          <Calendar size={14} />
          {experienceLevel}
        </span>
        {salaryRange && (
          <span className="meta-item meta-salary">
            <DollarSign size={14} />
            {salaryRange}
          </span>
        )}
      </div>

      <p className="job-card-description">
        {description?.length > 140 ? `${description.substring(0, 140)}...` : description}
      </p>

      {skills.length > 0 && (
        <div className="job-card-skills">
          {skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="skill-pill">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="skill-pill skill-more">+{skills.length - 4} more</span>
          )}
        </div>
      )}

      <div className="job-card-footer">
        <span className="job-posted-date">Posted on {postedDate}</span>
        <Link to={`/jobs/${id}`} className="btn btn-outline btn-sm view-job-btn">
          <span>View Details</span>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
