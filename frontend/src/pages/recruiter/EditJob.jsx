import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getRecruiterJobById, saveRecruiterJob } from '../../data/recruiterJobs';
import JobForm from '../../components/recruiter/JobForm';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const jobToEdit = getRecruiterJobById(id, user);

  if (!jobToEdit) {
    return (
      <div className="card empty-state-card max-w-xl mx-auto my-5 p-4 text-center">
        <div className="empty-icon-box danger mb-3">
          <AlertCircle size={32} />
        </div>
        <h2>Job Requisition Not Found</h2>
        <p className="text-muted mb-4">
          The requested job posting (ID: <code>{id}</code>) could not be located or may have been removed.
        </p>
        <Link to="/recruiter/jobs" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Manage Jobs</span>
        </Link>
      </div>
    );
  }

  const handleEditSubmit = (updatedData) => {
    saveRecruiterJob(updatedData, user);
    navigate('/recruiter/jobs');
  };

  return (
    <div className="edit-job-page max-w-4xl mx-auto">
      <JobForm
        initialValues={jobToEdit}
        onSubmit={handleEditSubmit}
        isEditing={true}
      />
    </div>
  );
};

export default EditJob;
