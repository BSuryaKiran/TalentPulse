import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { getRecruiterProfile, saveRecruiterProfile } from '../../data/recruiter';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Edit3,
  CheckCircle2,
  XCircle,
  Save,
  Building,
  UserCheck,
} from 'lucide-react';

const RecruiterProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() => getRecruiterProfile(user));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Recruiter Name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address format';
    }
    if (!formData.companyName?.trim()) {
      newErrors.companyName = 'Company Name is required';
    }
    if (!formData.designation?.trim()) {
      newErrors.designation = 'Designation is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updated = saveRecruiterProfile(formData, user);
    setProfile(updated);
    setIsEditing(false);
    setSuccessMessage('Recruiter profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleCancel = () => {
    setFormData(profile);
    setErrors({});
    setIsEditing(false);
  };

  const initialLetter = (profile.fullName || user?.name || 'R').charAt(0).toUpperCase();

  return (
    <div className="recruiter-profile-page">
      {/* Toast Notice */}
      {successMessage && (
        <div className="alert alert-success profile-alert" role="alert">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Profile Header Banner */}
      <div className="profile-header-card recruiter-profile-header">
        <div className="profile-banner-bg" />
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar recruiter-profile-avatar">
              {initialLetter}
            </div>
          </div>

          <div className="profile-identity">
            <div className="identity-top">
              <h1 className="profile-name">{profile.fullName}</h1>
              <span className="badge badge-recruiter">
                <UserCheck size={12} style={{ marginRight: 4 }} />
                RECRUITER
              </span>
            </div>
            <p className="profile-title-display">
              {profile.designation} &bull; <strong className="company-name-text">{profile.companyName}</strong>
            </p>
            <div className="profile-meta-row">
              <span className="meta-item">
                <Building2 size={14} />
                {profile.department || 'Human Resources'}
              </span>
              <span className="meta-item">
                <MapPin size={14} />
                {profile.location || 'Location Not Specified'}
              </span>
            </div>
          </div>

          <div className="profile-action-btn-group">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary edit-profile-trigger"
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex-gap-sm">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline"
                >
                  <XCircle size={16} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body: Form or Overview Cards */}
      {isEditing ? (
        <form onSubmit={handleSave} className="profile-edit-form-card card">
          <div className="card-header">
            <h2 className="card-title">Edit Recruiter Information</h2>
            <p className="card-subtitle">Update your employer details and contact preferences</p>
          </div>

          <div className="card-body">
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Recruiter Full Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sarah Jenkins"
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Work Email <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. recruiter@company.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="companyName" className="form-label">
                  Company Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  className={`form-input ${errors.companyName ? 'input-error' : ''}`}
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g. TechPulse Global"
                />
                {errors.companyName && <span className="error-text">{errors.companyName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="designation" className="form-label">
                  Designation / Role <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  className={`form-input ${errors.designation ? 'input-error' : ''}`}
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g. Talent Acquisition Lead"
                />
                {errors.designation && <span className="error-text">{errors.designation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. +1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="companyWebsite" className="form-label">Company Website URL</label>
                <input
                  type="url"
                  id="companyWebsite"
                  name="companyWebsite"
                  className="form-input"
                  value={formData.companyWebsite || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. https://company.example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">Location / City</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-input"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department" className="form-label">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="form-input"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Human Resources"
                />
              </div>
            </div>

            <div className="form-group full-width mt-3">
              <label htmlFor="companyDescription" className="form-label">Company Overview / Description</label>
              <textarea
                id="companyDescription"
                name="companyDescription"
                rows="4"
                className="form-textarea"
                value={formData.companyDescription || ''}
                onChange={handleInputChange}
                placeholder="Provide a short description of your company culture, mission, and hiring focus..."
              />
            </div>
          </div>

          <div className="card-footer form-actions-footer">
            <button type="button" onClick={handleCancel} className="btn btn-outline">
              <XCircle size={16} />
              <span>Cancel</span>
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save Recruiter Profile</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details-grid">
          {/* Contact & Professional Info Card */}
          <div className="card profile-info-card">
            <div className="card-header">
              <h2 className="card-title">Contact & Organization</h2>
            </div>
            <div className="card-body info-list">
              <div className="info-row">
                <div className="info-icon">
                  <Mail size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Work Email</span>
                  <span className="info-value">{profile.email || 'Not specified'}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon">
                  <Phone size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Phone Number</span>
                  <span className="info-value">{profile.phone || 'Not specified'}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon">
                  <Building size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Company</span>
                  <span className="info-value">{profile.companyName}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon">
                  <Briefcase size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Designation</span>
                  <span className="info-value">{profile.designation}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon">
                  <Globe size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Company Website</span>
                  <span className="info-value">
                    {profile.companyWebsite ? (
                      <a
                        href={profile.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-external"
                      >
                        {profile.companyWebsite}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Overview & Description Card */}
          <div className="card company-description-card">
            <div className="card-header">
              <h2 className="card-title">Company Profile</h2>
            </div>
            <div className="card-body">
              {profile.companyDescription ? (
                <p className="description-text">{profile.companyDescription}</p>
              ) : (
                <div className="empty-state-sm">
                  <p>No company description provided yet. Click <strong>Edit Profile</strong> to add employer details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterProfile;
