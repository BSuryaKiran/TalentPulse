import { useState } from 'react';
import { FileText, Upload, CheckCircle2, Download, AlertCircle, Plus } from 'lucide-react';
import { downloadResumePdf } from '../../utils/resumeDownloader';

const ResumeSection = ({ resume, profile, onUpdateResume }) => {
  const [mockMessage, setMockMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newResumeData = {
        fileName: file.name,
        status: 'Uploaded & Active',
        lastUploaded: new Date().toISOString().split('T')[0],
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };
      setMockMessage(`Uploaded "${file.name}" successfully.`);
      if (onUpdateResume) {
        onUpdateResume(newResumeData);
      }
    }
  };

  const handleDownload = () => {
    downloadResumePdf(profile || { resume });
  };

  return (
    <div className="profile-section-card">
      <div className="section-card-header">
        <div className="section-title-with-icon">
          <FileText size={20} className="section-icon" />
          <h2>Resume & Documents</h2>
        </div>
      </div>

      {resume ? (
        <div className="resume-box">
          <div className="resume-info-left">
            <div className="resume-file-icon">
              <FileText size={28} />
            </div>
            <div className="resume-details">
              <h3 className="resume-filename">{resume.fileName}</h3>
              <p className="resume-meta">
                <span>Size: {resume.fileSize || '1.2 MB'}</span> •{' '}
                <span>Last updated: {resume.lastUploaded || new Date().toISOString().split('T')[0]}</span>
              </p>
              <div className="resume-status-badge mt-1">
                <CheckCircle2 size={13} style={{ marginRight: 4 }} />
                <span>{resume.status || 'Verified & Active'}</span>
              </div>
            </div>
          </div>

          <div className="resume-actions-right">
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-outline btn-sm"
              title="Download / Print Resume"
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
                onChange={handleFileChange}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="empty-section-card text-center">
          <div className="empty-section-icon">
            <FileText size={32} />
          </div>
          <p className="empty-section-text">No resume uploaded yet.</p>
          <p className="empty-section-sub">Upload your resume in PDF or Word format to apply for jobs effortlessly.</p>
          <label className="btn btn-primary btn-sm mt-2 upload-resume-label" style={{ display: 'inline-flex' }}>
            <Plus size={16} style={{ marginRight: 6 }} />
            <span>Upload Resume</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="visually-hidden"
            />
          </label>
        </div>
      )}

      {mockMessage && (
        <div className="alert alert-info mt-3" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
          <CheckCircle2 size={14} style={{ marginRight: 6, color: '#10b981' }} />
          <span>{mockMessage}</span>
        </div>
      )}

      <div className="resume-disclaimer mt-3">
        <AlertCircle size={13} style={{ marginRight: 4, flexShrink: 0 }} />
        <span>
          Candidate resumes are stored in your secure workspace profile for easy job applications.
        </span>
      </div>
    </div>
  );
};

export default ResumeSection;

