import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Edit3, UserCheck } from 'lucide-react';

const ProfileHeader = ({ profile, isEditMode = false }) => {
  if (!profile) return null;

  const { fullName, email, phone, location, summary } = profile;

  return (
    <div className="profile-header-card">
      <div className="ph-top">
        <div className="ph-avatar">
          {fullName ? fullName.charAt(0).toUpperCase() : 'JS'}
        </div>
        <div className="ph-info">
          <div className="ph-title-row">
            <h1 className="ph-name">{fullName || 'Candidate Name'}</h1>
            <span className="badge badge-seeker">
              <UserCheck size={14} style={{ marginRight: 4 }} />
              JOB SEEKER
            </span>
          </div>

          <div className="ph-contact-grid">
            <div className="ph-contact-item">
              <Mail size={15} />
              <span>{email}</span>
            </div>
            {phone && (
              <div className="ph-contact-item">
                <Phone size={15} />
                <span>{phone}</span>
              </div>
            )}
            {location && (
              <div className="ph-contact-item">
                <MapPin size={15} />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {!isEditMode && (
          <div className="ph-actions">
            <Link to="/job-seeker/profile/edit" className="btn btn-primary">
              <Edit3 size={16} style={{ marginRight: 6 }} />
              Edit Profile
            </Link>
          </div>
        )}
      </div>

      {summary && (
        <div className="ph-summary-section">
          <h3>Professional Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
