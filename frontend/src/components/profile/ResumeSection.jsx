import { useState } from 'react';
import { FileText, Upload, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ResumeSection = ({ resume, onUpdateResume }) => {
  const [mockMessage, setMockMessage] = useState('');

  const currentResume = resume || {
    fileName: 'Alex_Morgan_Resume_2026.pdf',
    status: 'Verified & Active',
    lastUploaded: '2026-03-01',
    fileSize: '1.2 MB',
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMockMessage(`Selected file "${file.name}" for upload demonstration.`);
      if (onUpdateResume) {
        onUpdateResume({
          fileName: file.name,
          status: 'Uploaded (Mock Demo)',
          lastUploaded: new Date().toISOString().split('T')[0],
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        });
      }
    }
  };

  return (
    <div className="profile-section-card">
      <div className="section-card-header">
        <div className="section-title-with-icon">
          <FileText size={20} className="section-icon" />
          <h2>Resume & Documents</h2>
        </div>
      </div>

      <div className="resume-box">
        <div className="resume-info-left">
          <div className="resume-file-icon">
            <FileText size={28} />
          </div>
          <div className="resume-details">
            <h3 className="resume-filename">{currentResume.fileName}</h3>
            <p className="resume-meta">
              <span>Size: {currentResume.fileSize || '1.2 MB'}</span> •{' '}
              <span>Last updated: {currentResume.lastUploaded || '2026-03-01'}</span>
            </p>
            <div className="resume-status-badge mt-1">
              <CheckCircle2 size={13} style={{ marginRight: 4 }} />
              <span>{currentResume.status || 'Active'}</span>
            </div>
          </div>
        </div>

        <div className="resume-actions-right">
          <label className="btn btn-outline btn-sm upload-resume-label">
            <Upload size={16} style={{ marginRight: 6 }} />
            <span>Replace Resume</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="visually-hidden"
            />
          </label>
        </div>
      </div>

      {mockMessage && (
        <div className="alert alert-info mt-3" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
          <Clock size={14} style={{ marginRight: 6 }} />
          <span>{mockMessage}</span>
        </div>
      )}

      <div className="resume-disclaimer mt-3">
        <AlertCircle size={13} style={{ marginRight: 4, flexShrink: 0 }} />
        <span>
          Frontend UI placeholder: Uploaded files are processed in local session state for demonstration.
        </span>
      </div>
    </div>
  );
};

export default ResumeSection;
