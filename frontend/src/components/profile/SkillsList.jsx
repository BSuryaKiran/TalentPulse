import { useState } from 'react';
import { Award, Plus, X } from 'lucide-react';

const SkillsList = ({ skills = [], isEditMode = false, onAddSkill, onRemoveSkill }) => {
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (onAddSkill) {
      onAddSkill(newSkillInput.trim());
      setNewSkillInput('');
    }
  };

  return (
    <div className="profile-section-card">
      <div className="section-card-header">
        <div className="section-title-with-icon">
          <Award size={20} className="section-icon" />
          <h2>Skills & Expertise</h2>
        </div>
      </div>

      {isEditMode && (
        <form onSubmit={handleAdd} className="add-skill-form mb-3">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            placeholder="Add a new skill (e.g. React, Spring Boot, SQL)..."
            className="skill-input"
          />
          <button type="submit" className="btn btn-outline btn-sm">
            <Plus size={16} style={{ marginRight: 4 }} />
            Add Skill
          </button>
        </form>
      )}

      {skills.length === 0 ? (
        <p className="empty-section-text">No skills added yet.</p>
      ) : (
        <div className="skills-chips-grid">
          {skills.map((skill, index) => (
            <span key={index} className="skill-chip">
              <span className="skill-chip-text">{skill}</span>
              {isEditMode && onRemoveSkill && (
                <button
                  type="button"
                  onClick={() => onRemoveSkill(index)}
                  className="remove-skill-btn"
                  title={`Remove ${skill}`}
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsList;
