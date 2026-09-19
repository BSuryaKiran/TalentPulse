import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import jobService from '../../services/jobService';
import JobForm from '../../components/recruiter/JobForm';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobToEdit, setJobToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setFetchError('');

    jobService
      .getJobById(id, user)
      .then((data) => {
        if (isMounted) setJobToEdit(data);
      })
      .catch((err) => {
        if (isMounted) setFetchError(err.message || 'Job requisition not found.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const handleEditSubmit = async (updatedData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await jobService.updateJob(id, updatedData, user);
      navigate('/recruiter/jobs');
    } catch (err) {
      setSubmitError(err.message || 'Failed to update job requisition.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card max-w-xl mx-auto my-5 p-5 text-center">
        <div className="spinner mx-auto mb-3" />
        <p className="text-muted">Loading job requisition details...</p>
      </div>
    );
  }

  if (fetchError || !jobToEdit) {
    return (
      <div className="card empty-state-card max-w-xl mx-auto my-5 p-4 text-center">
        <div className="empty-icon-box danger mb-3">
          <AlertCircle size={32} />
        </div>
        <h2>Job Requisition Not Found</h2>
        <p className="text-muted mb-4">
          {fetchError || `The requested job posting (ID: ${id}) could not be located.`}
        </p>
        <Link to="/recruiter/jobs" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Manage Jobs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="edit-job-page max-w-4xl mx-auto">
      {submitError && (
        <div className="alert alert-danger mb-4 flex-align-center gap-2">
          <AlertCircle size={18} />
          <span>{submitError}</span>
        </div>
      )}
      <fieldset disabled={isSubmitting} style={{ border: 'none', padding: 0, margin: 0 }}>
        <JobForm
          initialValues={jobToEdit}
          onSubmit={handleEditSubmit}
          isEditing={true}
        />
      </fieldset>
    </div>
  );
};

export default EditJob;
