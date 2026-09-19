import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, ArrowLeft, Layers, CheckCircle2, Clock } from 'lucide-react';

const ManageJobs = () => {
  return (
    <div className="recruiter-placeholder-page">
      <div className="placeholder-card card">
        <div className="placeholder-badge recruiter-badge mb-3">
          <Briefcase size={20} />
          <span>Recruiter Workspace &bull; Job Management</span>
        </div>

        <h1 className="placeholder-title">Manage Jobs</h1>
        <p className="placeholder-description">
          Requisition management, posting workflows, and job status management will be fully integrated in Phase 2.
        </p>

        <div className="placeholder-features-grid mt-4">
          <div className="feature-item-card">
            <div className="feature-icon-box">
              <PlusCircle size={20} />
            </div>
            <div>
              <h3>Requisition Creation</h3>
              <p>Define job descriptions, salary ranges, location requirements, and skill tags.</p>
            </div>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-box">
              <Layers size={20} />
            </div>
            <div>
              <h3>Pipeline Tracking</h3>
              <p>Monitor active applicant counts per job posting and filter by candidate stage.</p>
            </div>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-box">
              <Clock size={20} />
            </div>
            <div>
              <h3>Listing Status</h3>
              <p>Toggle requisitions between Active, Draft, Paused, and Closed states.</p>
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

export default ManageJobs;
