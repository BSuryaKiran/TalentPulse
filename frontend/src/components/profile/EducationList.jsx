import { useState } from 'react';
import { GraduationCap, Plus, Trash2, Calendar, Building2 } from 'lucide-react';

const EducationList = ({
  education = [],
  isEditMode = false,
  onAddEducation,
  onRemoveEducation,
}) => {
  const [newEdu, setNewEdu] = useState({
    degree: '',
    institution: '',
    startYear: '',
    endYear: '',
  });

  const [formError, setFormError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newEdu.degree.trim() || !newEdu.institution.trim()) {
      setFormError('Please enter both Degree and Institution.');
      return;
    }

    if (onAddEducation) {
      onAddEducation({
        id: 'edu-' + Date.now(),
        degree: newEdu.degree.trim(),
        institution: newEdu.institution.trim(),
        startYear: newEdu.startYear.trim() || 'N/A',
        endYear: newEdu.endYear.trim() || 'N/A',
      });

      setNewEdu({ degree: '', institution: '', startYear: '', endYear: '' });
      setFormError('');
    }
  };

  return (
    <div className="profile-section-card">
      <div className="section-card-header">
        <div className="section-title-with-icon">
          <GraduationCap size={20} className="section-icon" />
          <h2>Education History</h2>
        </div>
      </div>

      {isEditMode && (
        <div className="add-entry-box mb-4">
          <h4>Add New Education Entry</h4>
          {formError && <p className="error-message mb-2">{formError}</p>}
          <div className="form-grid-2">
            <div className="form-group">
              <label>Degree / Certificate *</label>
              <input
                type="text"
                value={newEdu.degree}
                onChange={(e) => setNewEdu((prev) => ({ ...prev, degree: e.target.value }))}
                placeholder="e.g. B.S. in Computer Science"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Institution / University *</label>
              <input
                type="text"
                value={newEdu.institution}
                onChange={(e) => setNewEdu((prev) => ({ ...prev, institution: e.target.value }))}
                placeholder="e.g. UC Berkeley"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Start Year</label>
              <input
                type="text"
                value={newEdu.startYear}
                onChange={(e) => setNewEdu((prev) => ({ ...prev, startYear: e.target.value }))}
                placeholder="e.g. 2018"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>End Year (or Present)</label>
              <input
                type="text"
                value={newEdu.endYear}
                onChange={(e) => setNewEdu((prev) => ({ ...prev, endYear: e.target.value }))}
                placeholder="e.g. 2022"
                className="form-input"
              />
            </div>
          </div>
          <button type="button" onClick={handleAdd} className="btn btn-outline btn-sm mt-3">
            <Plus size={16} style={{ marginRight: 4 }} />
            Add Education Entry
          </button>
        </div>
      )}

      {education.length === 0 ? (
        <p className="empty-section-text">No education entries added yet.</p>
      ) : (
        <div className="entries-list">
          {education.map((item, index) => (
            <div key={item.id || index} className="entry-card">
              <div className="entry-header">
                <div>
                  <h3 className="entry-title">{item.degree}</h3>
                  <p className="entry-sub">
                    <Building2 size={14} style={{ marginRight: 4 }} />
                    {item.institution}
                  </p>
                </div>
                {isEditMode && onRemoveEducation && (
                  <button
                    type="button"
                    onClick={() => onRemoveEducation(index)}
                    className="btn-remove-entry"
                    title="Remove education entry"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationList;
