import { useState } from 'react';
import { Briefcase, Plus, Trash2, Calendar, Building2 } from 'lucide-react';

const ExperienceList = ({
  experience = [],
  isEditMode = false,
  onAddExperience,
  onRemoveExperience,
}) => {
  const [newExp, setNewExp] = useState({
    title: '',
    company: '',
    startYear: '',
    endYear: '',
    description: '',
  });

  const [formError, setFormError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newExp.title.trim() || !newExp.company.trim()) {
      setFormError('Please enter both Job Title and Company.');
      return;
    }

    if (onAddExperience) {
      onAddExperience({
        id: 'exp-' + Date.now(),
        title: newExp.title.trim(),
        company: newExp.company.trim(),
        startYear: newExp.startYear.trim() || 'N/A',
        endYear: newExp.endYear.trim() || 'Present',
        description: newExp.description.trim() || 'No description provided.',
      });

      setNewExp({ title: '', company: '', startYear: '', endYear: '', description: '' });
      setFormError('');
    }
  };

  return (
    <div className="profile-section-card">
      <div className="section-card-header">
        <div className="section-title-with-icon">
          <Briefcase size={20} className="section-icon" />
          <h2>Work Experience</h2>
        </div>
      </div>

      {isEditMode && (
        <div className="add-entry-box mb-4">
          <h4>Add New Experience Entry</h4>
          {formError && <p className="error-message mb-2">{formError}</p>}
          <div className="form-grid-2">
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                value={newExp.title}
                onChange={(e) => setNewExp((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Software Engineer"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                value={newExp.company}
                onChange={(e) => setNewExp((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="e.g. CloudPulse Technologies"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Start Year / Date</label>
              <input
                type="text"
                value={newExp.startYear}
                onChange={(e) => setNewExp((prev) => ({ ...prev, startYear: e.target.value }))}
                placeholder="e.g. 2022"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>End Year / Date (or Present)</label>
              <input
                type="text"
                value={newExp.endYear}
                onChange={(e) => setNewExp((prev) => ({ ...prev, endYear: e.target.value }))}
                placeholder="e.g. Present"
                className="form-input"
              />
            </div>
          </div>
          <div className="form-group mt-2">
            <label>Key Achievements & Responsibilities</label>
            <textarea
              rows={3}
              value={newExp.description}
              onChange={(e) => setNewExp((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your role and achievements..."
              className="form-textarea"
            />
          </div>
          <button type="button" onClick={handleAdd} className="btn btn-outline btn-sm mt-3">
            <Plus size={16} style={{ marginRight: 4 }} />
            Add Experience Entry
          </button>
        </div>
      )}

      {experience.length === 0 ? (
        <p className="empty-section-text">
          No work experience added yet (Fresher / Entry-Level).
        </p>
      ) : (
        <div className="entries-list">
          {experience.map((item, index) => (
            <div key={item.id || index} className="entry-card">
              <div className="entry-header">
                <div>
                  <h3 className="entry-title">{item.title}</h3>
                  <p className="entry-sub">
                    <Building2 size={14} style={{ marginRight: 4 }} />
                    {item.company}
                  </p>
                </div>
                {isEditMode && onRemoveExperience && (
                  <button
                    type="button"
                    onClick={() => onRemoveExperience(index)}
                    className="btn-remove-entry"
                    title="Remove experience entry"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="entry-meta">
                <Calendar size={13} style={{ marginRight: 4 }} />
                <span>
                  {item.startYear} – {item.endYear}
                </span>
              </div>
              {item.description && <p className="entry-description">{item.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceList;
