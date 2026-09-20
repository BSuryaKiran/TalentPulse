import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Users,
  Award,
  FileCheck2,
  ArrowRight,
  Layers,
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
    setSuccessMessage('Recruiter profile and company details updated successfully!');
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
        <div className="alert alert-success profile-alert mb-4" role="alert">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Recruiter Hero Header Banner */}
      <div className="profile-hero-banner recruiter-hero-banner">
        <div className="banner-pill recruiter-pill">
          <Sparkles size={14} />
          <span>Enterprise Recruiter & Employer Profile</span>
        </div>

        <div className="recruiter-hero-content">
          <div className="recruiter-avatar-box">
            <div className="recruiter-hero-avatar">
              {initialLetter}
            </div>
            <div className="avatar-badge-check" title="Verified Recruiter Account">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div className="recruiter-hero-info">
            <div className="recruiter-title-row">
              <h1 className="recruiter-hero-name">{profile.fullName}</h1>
              <span className="badge badge-recruiter">
                <UserCheck size={13} style={{ marginRight: 4 }} />
                RECRUITER
              </span>
            </div>

            <p className="recruiter-hero-sub">
              <span>{profile.designation}</span> &bull;{' '}
              <strong className="recruiter-company-highlight">{profile.companyName}</strong>
            </p>

            <div className="recruiter-meta-tags">
              <span className="recruiter-meta-pill">
                <Building2 size={13} />
                {profile.department || 'Talent Acquisition'}
              </span>
              <span className="recruiter-meta-pill">
                <MapPin size={13} />
                {profile.location || 'Location Not Specified'}
              </span>
              <span className="recruiter-meta-pill">
                <Mail size={13} />
                {profile.email}
              </span>
            </div>
          </div>

          <div className="recruiter-hero-actions">
            {!isEditing ? (
              <button
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(true);
                }}
                className="btn btn-primary edit-profile-hero-btn"
              >
                <Edit3 size={16} style={{ marginRight: 6 }} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex-align-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline edit-cancel-btn"
                >
                  <XCircle size={16} style={{ marginRight: 6 }} />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary edit-save-btn"
                >
                  <Save size={16} style={{ marginRight: 6 }} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recruiter Quick Metrics Bar */}
      <div className="recruiter-metrics-grid">
        <div className="recruiter-metric-card">
          <div className="metric-icon-box icon-blue">
            <Briefcase size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-val">12</span>
            <span className="metric-label">Active Requisitions</span>
          </div>
        </div>

        <div className="recruiter-metric-card">
          <div className="metric-icon-box icon-indigo">
            <Users size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-val">148</span>
            <span className="metric-label">Candidates Applied</span>
          </div>
        </div>

        <div className="recruiter-metric-card">
          <div className="metric-icon-box icon-purple">
            <Award size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-val">34</span>
            <span className="metric-label">Shortlisted Talent</span>
          </div>
        </div>

        <div className="recruiter-metric-card">
          <div className="metric-icon-box icon-emerald">
            <Building size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-val">{profile.companyName ? profile.companyName.split(' ')[0] : 'Enterprise'}</span>
            <span className="metric-label">Organization Team</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Form when editing, or Grid Overview */}
      {isEditing ? (
        <form onSubmit={handleSave} className="profile-edit-form-card">
          <div className="card-header-styled">
            <div className="flex-align-center gap-2">
              <Edit3 size={18} className="text-emerald" />
              <h2>Edit Recruiter & Company Details</h2>
            </div>
            <p className="card-subtitle">
              Update your public employer details, designation, contact channels, and company description.
            </p>
          </div>

          <div className="form-card-body">
            {/* Section 1: Personal / Professional Identity */}
            <div className="form-sub-section">
              <h3 className="form-section-title">
                <UserCheck size={16} />
                <span>Recruiter Identity & Contact</span>
              </h3>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name <span className="required-star">*</span>
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
                  <label htmlFor="designation" className="form-label">
                    Designation / Title <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    className={`form-input ${errors.designation ? 'input-error' : ''}`}
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Talent Acquisition Lead"
                  />
                  {errors.designation && <span className="error-text">{errors.designation}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Contact Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-input"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 (555) 492-8102"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Organization / Company Details */}
            <div className="form-sub-section mt-4">
              <h3 className="form-section-title">
                <Building2 size={16} />
                <span>Organization & Employer Information</span>
              </h3>

              <div className="form-grid-2">
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
                    placeholder="e.g. TechPulse Global Solutions"
                  />
                  {errors.companyName && <span className="error-text">{errors.companyName}</span>}
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
                    placeholder="e.g. https://techpulse.example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department" className="form-label">Department / Unit</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    className="form-input"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Human Resources & Talent Acquisition"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">Primary Office Location</label>
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
              </div>

              <div className="form-group full-width mt-3">
                <label htmlFor="companyDescription" className="form-label">
                  Company Overview & Culture Statement
                </label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  rows="4"
                  className="form-textarea"
                  value={formData.companyDescription || ''}
                  onChange={handleInputChange}
                  placeholder="Provide an overview of your company mission, hiring culture, tech stack, and benefits..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="form-actions-bar">
            <button type="button" onClick={handleCancel} className="btn btn-outline">
              <XCircle size={16} style={{ marginRight: 6 }} />
              <span>Cancel</span>
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} style={{ marginRight: 6 }} />
              <span>Save Recruiter Profile</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="recruiter-profile-columns">
          {/* Left Column: Organization & Contact Cards */}
          <div className="profile-col-main">
            {/* Contact & Professional Details Card */}
            <div className="section-card">
              <div className="section-card-header">
                <h2>Contact & Professional Details</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline btn-xs flex-align-center gap-1"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="recruiter-details-grid">
                <div className="rd-item">
                  <div className="rd-icon-box icon-blue">
                    <Mail size={18} />
                  </div>
                  <div className="rd-content">
                    <span className="rd-label">Work Email</span>
                    <span className="rd-val">{profile.email || 'Not specified'}</span>
                  </div>
                </div>

                <div className="rd-item">
                  <div className="rd-icon-box icon-emerald">
                    <Phone size={18} />
                  </div>
                  <div className="rd-content">
                    <span className="rd-label">Phone Number</span>
                    <span className="rd-val">{profile.phone || 'Not specified'}</span>
                  </div>
                </div>

                <div className="rd-item">
                  <div className="rd-icon-box icon-indigo">
                    <Building2 size={18} />
                  </div>
                  <div className="rd-content">
                    <span className="rd-label">Employer / Organization</span>
                    <span className="rd-val font-semibold">{profile.companyName}</span>
                  </div>
                </div>

                <div className="rd-item">
                  <div className="rd-icon-box icon-purple">
                    <Briefcase size={18} />
                  </div>
                  <div className="rd-content">
                    <span className="rd-label">Designation</span>
                    <span className="rd-val">{profile.designation}</span>
                  </div>
                </div>

                <div className="rd-item">
                  <div className="rd-icon-box icon-amber">
                    <Globe size={18} />
                  </div>
                  <div className="rd-content">
                    <span className="rd-label">Company Website</span>
                    <span className="rd-val">
                      {profile.companyWebsite ? (
                        <a
                          href={profile.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-website flex-align-center gap-1"
                        >
                          <span>{profile.companyWebsite}</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </span>
                  </div>
                </div>

                <div className="rd-item">
                  <div className="rd-icon-box icon-slate">
                    <MapPin size={18} />
                  </div>
                  <div className="rd-content">
                    <span className="rd-label">Office Headquarters</span>
                    <span className="rd-val">{profile.location || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Overview & Culture Statement Card */}
            <div className="section-card mt-4">
              <div className="section-card-header">
                <h2>About {profile.companyName}</h2>
                <span className="badge badge-recruiter">Employer Overview</span>
              </div>

              <div className="company-statement-body">
                {profile.companyDescription ? (
                  <p className="company-bio-text">{profile.companyDescription}</p>
                ) : (
                  <div className="empty-state-mini">
                    <Building2 size={32} className="text-muted mb-2" />
                    <p>No company overview provided yet.</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-outline btn-sm mt-2"
                    >
                      Add Company Overview
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Requisitions & Platform Status */}
          <div className="profile-col-side">
            {/* Quick Actions Card */}
            <div className="section-card mb-4">
              <div className="section-card-header">
                <h2>Recruiter Shortcuts</h2>
              </div>

              <div className="quick-actions-grid">
                <Link to="/recruiter/jobs" className="quick-action-card">
                  <div className="qa-icon icon-emerald">
                    <Briefcase size={18} />
                  </div>
                  <div className="qa-text">
                    <h3>Manage Job Requisitions</h3>
                    <p>Publish, edit, or close open positions</p>
                  </div>
                  <ArrowRight size={15} className="qa-arrow" />
                </Link>

                <Link to="/recruiter/applicants" className="quick-action-card">
                  <div className="qa-icon icon-indigo">
                    <FileCheck2 size={18} />
                  </div>
                  <div className="qa-text">
                    <h3>Review Candidates</h3>
                    <p>Screen applicants and update pipeline</p>
                  </div>
                  <ArrowRight size={15} className="qa-arrow" />
                </Link>

                <Link to="/recruiter/dashboard" className="quick-action-card">
                  <div className="qa-icon icon-blue">
                    <Layers size={18} />
                  </div>
                  <div className="qa-text">
                    <h3>Recruiter Dashboard</h3>
                    <p>View hiring funnel and applicant analytics</p>
                  </div>
                  <ArrowRight size={15} className="qa-arrow" />
                </Link>
              </div>
            </div>

            {/* Security & Verification Card */}
            <div className="section-card">
              <div className="section-card-header">
                <h2>Account Verification</h2>
                <ShieldCheck size={18} className="text-emerald" />
              </div>

              <div className="verification-badges-list">
                <div className="v-item">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <div className="v-text">
                    <strong>Enterprise Recruiter Privileges</strong>
                    <span>Authorized to post jobs and review resumes</span>
                  </div>
                </div>

                <div className="v-item">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <div className="v-text">
                    <strong>Direct Candidate Messaging</strong>
                    <span>Active candidate communication channels</span>
                  </div>
                </div>

                <div className="v-item">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <div className="v-text">
                    <strong>Applicant Tracking Integration</strong>
                    <span>Connected to TalentPulse Application Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterProfile;
