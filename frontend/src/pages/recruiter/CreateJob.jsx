import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { saveRecruiterJob } from '../../data/recruiterJobs';
import JobForm from '../../components/recruiter/JobForm';

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateSubmit = (jobData) => {
    saveRecruiterJob(jobData, user);
    navigate('/recruiter/jobs');
  };

  return (
    <div className="create-job-page max-w-4xl mx-auto">
      <JobForm onSubmit={handleCreateSubmit} isEditing={false} />
    </div>
  );
};

export default CreateJob;
