import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getProfile, saveProfile } from '../../data/profile';
import profileService from '../../services/profileService';
import SkillsList from '../../components/profile/SkillsList';
import EducationList from '../../components/profile/EducationList';
import ExperienceList from '../../components/profile/ExperienceList';
import { downloadResumePdf } from '../../utils/resumeDownloader';
import {
  Save,
  X,
  ArrowLeft,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Download,
  Trash2,
  Plus,
} from 'lucide-react';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(() => getProfile(user));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resumeNotice, setResumeNotice] = useState('');

  useEffect(() => {
    setProfileData(getProfile(user));
  }, [user]);

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Resume handlers
  const handleResumeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newResume = {
        fileName: file.name,
        status: 'Uploaded & Active',
        lastUploaded: new Date().toISOString().split('T')[0],
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };
      setProfileData((prev) => ({ ...prev, resume: newResume }));
      setResumeNotice(`Uploaded "${file.name}" (will be saved with profile).`);
    }
  };

  const handleRemoveResume = () => {
    setProfileData((prev) => ({ ...prev, resume: null }));
    setResumeNotice('Resume removed. You can upload a new resume anytime.');
  };

  const handleDownloadResume = () => {
    downloadResumePdf(profileData);
  };

  // Skills handlers
  const handleAddSkill = (skill) => {
    if (!skill) return;
    setProfileData((prev) => {
      const currentSkills = prev.skills || [];
      if (currentSkills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
        return prev; // Avoid duplicates
      }
      return { ...prev, skills: [...currentSkills, skill] };
    });
  };

  const handleRemoveSkill = (indexToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  // Education handlers
  const handleAddEducation = (newEdu) => {
    setProfileData((prev) => ({
      ...prev,
      education: [...(prev.education || []), newEdu],
    }));
  };

  const handleRemoveEducation = (indexToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  // Experience handlers
  const handleAddExperience = (newExp) => {
    setProfileData((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), newExp],
    }));
  };

  const handleRemoveExperience = (indexToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  // Basic Validation
  const validate = () => {
    const newErrors = {};

    if (!profileData.fullName?.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!profileData.email?.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (profileData.phone && profileData.phone.length < 7) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      // Attempt to save to Profile Service API
      if (user?.id) {
        try {
          await profileService.updateProfile(user.id, profileData);
        } catch {
          // If Profile Service backend is pending, save to local storage
          saveProfile(profileData, user);
        }
      } else {
        saveProfile(profileData, user);
      }

      // Synchronize updated name and email in global auth context (sidebar, topbar, dashboard)
      if (updateUser && profileData.fullName) {
        updateUser({
          name: profileData.fullName,
          email: profileData.email || user?.email,
        });
      }

      setSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        navigate('/job-seeker/profile');
      }, 900);
    } catch (err) {
      console.error('Save profile error:', err);
      setSaving(false);
      setErrors({ general: 'Failed to save profile changes. Please try again.' });
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-top-bar">
        <Link to="/job-seeker/profile" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} style={{ marginRight: 6 }} />
          Back to Profile
        </Link>
        <h1>Edit Candidate Profile</h1>
      </div>

      {saveSuccess && (
        <div className="alert alert-success-banner mb-4">
          <div className="alert-content">
            <CheckCircle2 size={20} className="alert-icon" />
            <div>
              <strong>Profile Saved Successfully!</strong>
              <p>Redirecting to profile view...</p>
            </div>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="alert alert-error mb-4">
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        {/* Personal & Contact Information Card */}
        <div className="profile-section-card">
          <div className="section-card-header">
            <div className="section-title-with-icon">
              <User size={20} className="section-icon" />
              <h2>Personal & Contact Information</h2>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={profileData.fullName || ''}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  className={errors.fullName ? 'input-error' : ''}
                />
              </div>
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={profileData.email || ''}
                  onChange={handleChange}
                  placeholder="e.g. alex@example.com"
                  className={errors.email ? 'input-error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <Phone size={16} className="input-icon" />
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={profileData.phone || ''}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 234-5678"
                  className={errors.phone ? 'input-error' : ''}
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location (City, State / Country)</label>
              <div className="input-wrapper">
                <MapPin size={16} className="input-icon" />
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={profileData.location || ''}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>
          </div>

          <div className="form-group mt-3">
            <label htmlFor="summary">Professional Summary</label>
            <textarea
              id="summary"
              name="summary"
              rows={4}
              value={profileData.summary || ''}
              onChange={handleChange}
              placeholder="Highlight your background, core technical skills, and career objective..."
              className="form-textarea"
            />
          </div>
        </div>

        {/* Resume & Documents Section */}
        <div className="profile-section-card">
          <div className="section-card-header">
            <div className="section-title-with-icon">
              <FileText size={20} className="section-icon" />
              <h2>Resume & Documents</h2>
            </div>
          </div>

          {profileData.resume ? (
            <div className="resume-box">
              <div className="resume-info-left">
                <div className="resume-file-icon">
                  <FileText size={28} />
                </div>
                <div className="resume-details">
                  <h3 className="resume-filename">{profileData.resume.fileName}</h3>
                  <p className="resume-meta">
                    <span>Size: {profileData.resume.fileSize || '1.2 MB'}</span> •{' '}
                    <span>Last updated: {profileData.resume.lastUploaded || 'Recent'}</span>
                  </p>
                  <div className="resume-status-badge mt-1">
                    <CheckCircle2 size={13} style={{ marginRight: 4 }} />
                    <span>{profileData.resume.status || 'Active'}</span>
                  </div>
                </div>
              </div>

              <div className="resume-actions-right">
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  className="btn btn-outline btn-sm"
                  title="Download / Print Resume PDF"
                >
                  <Download size={15} style={{ marginRight: 6 }} />
                  <span>Download PDF</span>
                </button>

                <label className="btn btn-outline btn-sm upload-resume-label">
                  <Upload size={15} style={{ marginRight: 6 }} />
                  <span>Replace</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeFileChange}
                    className="visually-hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="btn btn-outline btn-sm text-danger"
                  title="Remove Resume"
                >
                  <Trash2 size={15} style={{ marginRight: 4 }} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-section-card text-center">
              <div className="empty-section-icon">
                <FileText size={32} />
              </div>
              <p className="empty-section-text">No resume uploaded.</p>
              <p className="empty-section-sub">Upload a PDF or Word document for instant job applications.</p>
              <label className="btn btn-primary btn-sm mt-2 upload-resume-label" style={{ display: 'inline-flex' }}>
                <Plus size={16} style={{ marginRight: 6 }} />
                <span>Upload Resume</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeFileChange}
                  className="visually-hidden"
                />
              </label>
            </div>
          )}

          {resumeNotice && (
            <div className="alert alert-info mt-3" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
              <CheckCircle2 size={14} style={{ marginRight: 6, color: '#10b981' }} />
              <span>{resumeNotice}</span>
            </div>
          )}
        </div>

        {/* Skills Section Editor */}
        <SkillsList
          skills={profileData.skills || []}
          isEditMode={true}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
        />

        {/* Experience Section Editor */}
        <ExperienceList
          experience={profileData.experience || []}
          isEditMode={true}
          onAddExperience={handleAddExperience}
          onRemoveExperience={handleRemoveExperience}
        />

        {/* Education Section Editor */}
        <EducationList
          education={profileData.education || []}
          isEditMode={true}
          onAddEducation={handleAddEducation}
          onRemoveEducation={handleRemoveEducation}
        />

        {/* Sticky Form Action Footer Bar */}
        <div className="edit-actions-sticky-bar">
          <Link to="/job-seeker/profile" className="btn btn-outline">
            <X size={16} style={{ marginRight: 6 }} />
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
            <Save size={18} style={{ marginRight: 6 }} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
