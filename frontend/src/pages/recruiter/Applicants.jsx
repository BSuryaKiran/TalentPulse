import { Link } from 'react-router-dom';
import { Users, FileText, ArrowLeft, UserCheck, Search, Filter } from 'lucide-react';

const Applicants = () => {
  return (
    <div className="recruiter-placeholder-page">
      <div className="placeholder-card card">
        <div className="placeholder-badge recruiter-badge mb-3">
          <Users size={20} />
          <span>Recruiter Workspace &bull; Candidate Screening</span>
        </div>

        <h1 className="placeholder-title">Applicants</h1>
        <p className="placeholder-description">
          Candidate application management, resume reviewing, shortlisting, and interview scheduling will be fully integrated in Phase 2.
        </p>

        <div className="placeholder-features-grid mt-4">
          <div className="feature-item-card">
            <div className="feature-icon-box">
              <FileText size={20} />
            </div>
            <div>
              <h3>Resume & Application Viewer</h3>
              <p>Inspect candidate resumes, cover letters, and contact credentials inline.</p>
            </div>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-box">
              <UserCheck size={20} />
            </div>
            <div>
              <h3>Status Pipeline</h3>
              <p>Transition candidates across Applied, Under Review, Shortlisted, Interviewing, and Hired stages.</p>
            </div>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-box">
              <Filter size={20} />
            </div>
            <div>
              <h3>Search & Filters</h3>
              <p>Filter candidates by job posting, skill alignment, experience level, and application date.</p>
            </div>
          </div>
        </div>

        <div className="placeholder-footer-actions mt-4 pt-3">
          <Link to="/recruiter/dashboard" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to Recruiter Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
