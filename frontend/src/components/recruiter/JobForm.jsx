import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  Send,
  XCircle,
  Briefcase,
  Building2,
  ListChecks,
  Sparkles,
} from 'lucide-react';

const JobForm = ({ initialValues = {}, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    company: initialValues.company || 'TechPulse Global Solutions',
    employmentType: initialValues.employmentType || 'Full Time',
    workMode: initialValues.workMode || 'Hybrid',
    location: initialValues.location || 'San Francisco, CA',
    experience: initialValues.experience || '2–4 Years',
    salary: initialValues.salary || '$100,000 - $130,000 / year',
    deadline: initialValues.deadline || '',
    description: initialValues.description || '',
    skillsText: Array.isArray(initialValues.skills)
      ? initialValues.skills.join(', ')
      : initialValues.skills || '',
    responsibilitiesText: Array.isArray(initialValues.responsibilities)
      ? initialValues.responsibilities.join('\n')
      : initialValues.responsibilities || '',
    qualificationsText: Array.isArray(initialValues.qualifications)
      ? initialValues.qualifications.join('\n')
      : initialValues.qualifications || '',
    benefitsText: Array.isArray(initialValues.benefits)
      ? initialValues.benefits.join(', ')
      : initialValues.benefits || '',
    additionalInfo: initialValues.additionalInfo || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job Title is required.';
    if (!formData.company.trim()) newErrors.company = 'Company Name is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.deadline) newErrors.deadline = 'Application Deadline is required.';
    if (!formData.description.trim())
      newErrors.description = 'Job Description is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (targetStatus) => {
    if (!validateForm()) return;

    // Parse array fields
    const parsedSkills = formData.skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedResponsibilities = formData.responsibilitiesText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const parsedQualifications = formData.qualificationsText
      .split('\n')
      .map((q) => q.trim())
      .filter(Boolean);

    const parsedBenefits = formData.benefitsText
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      ...initialValues,
      title: formData.title.trim(),
      company: formData.company.trim(),
      employmentType: formData.employmentType,
      workMode: formData.workMode,
      location: formData.location.trim(),
      experience: formData.experience.trim(),
      salary: formData.salary.trim(),
      deadline: formData.deadline,
      description: formData.description.trim(),
      skills: parsedSkills,
      responsibilities: parsedResponsibilities,
      qualifications: parsedQualifications,
      benefits: parsedBenefits,
      additionalInfo: formData.additionalInfo.trim(),
      status: targetStatus,
    };

    onSubmit(payload);
  };

  return (
    <form className="job-form card">
      <div className="card-header border-bottom">
        <div className="form-header-badge mb-2">
          <Briefcase size={18} />
          <span>{isEditing ? 'Update Requisition' : 'New Job Requisition'}</span>
        </div>
        <h1 className="card-title text-xl">
          {isEditing ? `Edit Job: ${initialValues.title || ''}` : 'Post a New Job Requisition'}
        </h1>
        <p className="card-subtitle">
          Fill in the required position details, qualifications, and employment parameters below.
        </p>
      </div>

      <div className="card-body form-body-padding">
        {/* SECTION 1: JOB INFORMATION */}
        <div className="form-section">
          <h2 className="form-section-title">
            <Building2 size={18} />
            <span>Job Information</span>
          </h2>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Job Title <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="company" className="form-label">
                Company Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className={`form-input ${errors.company ? 'input-error' : ''}`}
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. TechPulse Global Solutions"
              />
              {errors.company && <span className="error-text">{errors.company}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="employmentType" className="form-label">
                Employment Type <span className="required-star">*</span>
              </label>
              <select
                id="employmentType"
                name="employmentType"
                className="form-select"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="workMode" className="form-label">
                Work Mode <span className="required-star">*</span>
              </label>
              <select
                id="workMode"
                name="workMode"
                className="form-select"
                value={formData.workMode}
                onChange={handleChange}
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-Site">On-Site</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className={`form-input ${errors.location ? 'input-error' : ''}`}
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA (or Remote)"
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="experience" className="form-label">Experience Required</label>
              <input
                type="text"
                id="experience"
                name="experience"
                className="form-input"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 2–5 Years"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary" className="form-label">Salary Range</label>
              <input
                type="text"
                id="salary"
                name="salary"
                className="form-input"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $110,000 - $140,000 / year"
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline" className="form-label">
                Application Deadline <span className="required-star">*</span>
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                className={`form-input ${errors.deadline ? 'input-error' : ''}`}
                value={formData.deadline}
                onChange={handleChange}
              />
              {errors.deadline && <span className="error-text">{errors.deadline}</span>}
            </div>
          </div>

          <div className="form-group full-width mt-3">
            <label htmlFor="description" className="form-label">
              Job Overview & Description <span className="required-star">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed summary of the position, team mission, and expectations..."
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
        </div>

        {/* SECTION 2: REQUIREMENTS & QUALIFICATIONS */}
        <div className="form-section mt-4">
          <h2 className="form-section-title">
            <ListChecks size={18} />
            <span>Requirements & Qualifications</span>
          </h2>

          <div className="form-group full-width mb-3">
            <label htmlFor="skillsText" className="form-label">
              Required Skills (Comma-separated)
            </label>
            <input
              type="text"
              id="skillsText"
              name="skillsText"
              className="form-input"
              value={formData.skillsText}
              onChange={handleChange}
              placeholder="e.g. React, JavaScript, TypeScript, Vite, REST APIs"
            />
            <span className="field-hint">Separate skill tags with commas</span>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="responsibilitiesText" className="form-label">
                Key Responsibilities (One per line)
              </label>
              <textarea
                id="responsibilitiesText"
                name="responsibilitiesText"
                rows="5"
                className="form-textarea"
                value={formData.responsibilitiesText}
                onChange={handleChange}
                placeholder="Architect modular UI components&#10;Collaborate with API engineers&#10;Optimize application performance"
              />
            </div>

            <div className="form-group">
              <label htmlFor="qualificationsText" className="form-label">
                Qualifications & Requirements (One per line)
              </label>
              <textarea
                id="qualificationsText"
                name="qualificationsText"
                rows="5"
                className="form-textarea"
                value={formData.qualificationsText}
                onChange={handleChange}
                placeholder="3+ years experience with React&#10;Proficiency in ES6+ and CSS3&#10;BS in Computer Science or equivalent"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: PERKS & ADDITIONAL INFO */}
        <div className="form-section mt-4">
          <h2 className="form-section-title">
            <Sparkles size={18} />
            <span>Benefits & Additional Information</span>
          </h2>

          <div className="form-group full-width mb-3">
            <label htmlFor="benefitsText" className="form-label">
              Benefits & Perks (Comma-separated)
            </label>
            <input
              type="text"
              id="benefitsText"
              name="benefitsText"
              className="form-input"
              value={formData.benefitsText}
              onChange={handleChange}
              placeholder="e.g. Health & Dental Insurance, 401(k) Matching, Remote Stipend, PTO"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="additionalInfo" className="form-label">
              Additional Internal Notes / EEOC Information
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows="3"
              className="form-textarea"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any equal opportunity employment statements or internal hiring team notes..."
            />
          </div>
        </div>
      </div>

      {/* FORM FOOTER ACTIONS */}
      <div className="card-footer form-actions-footer">
        <button
          type="button"
          onClick={() => navigate('/recruiter/jobs')}
          className="btn btn-outline"
        >
          <XCircle size={16} />
          <span>Cancel</span>
        </button>

        <div className="flex-gap-sm">
          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            className="btn btn-secondary"
          >
            <Save size={16} />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('ACTIVE')}
            className="btn btn-primary"
          >
            <Send size={16} />
            <span>{isEditing ? 'Save & Publish' : 'Publish Job'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default JobForm;
