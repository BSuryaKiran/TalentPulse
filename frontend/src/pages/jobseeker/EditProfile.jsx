import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getProfile, saveProfile } from '../../data/profile';
import profileService from '../../services/profileService';
import SkillsList from '../../components/profile/SkillsList';
import EducationList from '../../components/profile/EducationList';
import ExperienceList from '../../components/profile/ExperienceList';
import { Save, X, ArrowLeft, CheckCircle2, User, Mail, Phone, MapPin } from 'lucide-react';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(getProfile);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
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
          // If Profile Service backend is pending, save to local session store
          saveProfile(profileData);
        }
      } else {
        saveProfile(profileData);
      }

      setSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        navigate('/job-seeker/profile');
      }, 1000);
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
