import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import jobService from '../../services/jobService';
import JobForm from '../../components/recruiter/JobForm';
import { AlertCircle } from 'lucide-react';

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateSubmit = async (jobData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await jobService.createJob(jobData, user);
      navigate('/recruiter/jobs');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create job requisition.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-job-page max-w-4xl mx-auto">
      {errorMessage && (
        <div className="alert alert-danger mb-4 flex-align-center gap-2">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}
      <fieldset disabled={isSubmitting} style={{ border: 'none', padding: 0, margin: 0 }}>
        <JobForm onSubmit={handleCreateSubmit} isEditing={false} />
      </fieldset>
    </div>
  );
};

export default CreateJob;
