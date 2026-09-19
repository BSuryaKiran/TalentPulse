import api from './api';
import {
  getRecruiterJobs as getMockRecruiterJobs,
  getRecruiterJobById as getMockRecruiterJobById,
  saveRecruiterJob as saveMockRecruiterJob,
  deleteRecruiterJob as deleteMockRecruiterJob,
  updateJobStatus as updateMockJobStatus,
} from '../data/recruiterJobs';

const JOB_SERVICE_BASE_URL =
  import.meta.env.VITE_JOB_SERVICE_URL || 'http://localhost:8083';

/**
 * Extract recruiter identity from Auth user context
 */
const resolveRecruiterIdentity = (userOrEmail) => {
  let email = '';
  let id = null;

  if (typeof userOrEmail === 'string') {
    email = userOrEmail.trim();
  } else if (userOrEmail && typeof userOrEmail === 'object') {
    email = userOrEmail.email || '';
    id = userOrEmail.id || null;
  }

  if (!email) {
    try {
      const stored = localStorage.getItem('tp_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        email = parsed?.email || '';
        id = parsed?.id || null;
      }
    } catch {
      // ignore
    }
  }

  return {
    email: email || 'recruiter@talentpulse.com',
    id: id,
  };
};

/**
 * Format enum strings for UI display (e.g. FULL_TIME -> Full Time)
 */
const formatEnum = (val) => {
  if (!val) return '';
  if (val === 'FULL_TIME') return 'Full Time';
  if (val === 'PART_TIME') return 'Part Time';
  if (val === 'CONTRACT') return 'Contract';
  if (val === 'INTERNSHIP') return 'Internship';
  if (val === 'HYBRID') return 'Hybrid';
  if (val === 'REMOTE') return 'Remote';
  if (val === 'ON_SITE') return 'On-Site';
  return val;
};

/**
 * Maps Backend JobResponse -> Frontend Job model
 */
export const mapJobFromBackend = (data) => {
  if (!data) return null;
  return {
    id: String(data.id),
    title: data.title || '',
    company: data.companyName || data.company || 'TalentPulse Enterprise',
    companyName: data.companyName || data.company || 'TalentPulse Enterprise',
    description: data.description || '',
    employmentType: formatEnum(data.employmentType),
    workMode: formatEnum(data.workMode),
    location: data.location || '',
    experience: data.experience || '',
    salary: data.salary || '',
    deadline: data.applicationDeadline || data.deadline || '',
    applicationDeadline: data.applicationDeadline || data.deadline || '',
    skills: Array.isArray(data.requiredSkills)
      ? data.requiredSkills
      : Array.isArray(data.skills)
      ? data.skills
      : [],
    qualifications: Array.isArray(data.qualifications) ? data.qualifications : [],
    responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
    benefits: Array.isArray(data.benefits) ? data.benefits : [],
    additionalInfo: data.additionalInformation || '',
    additionalInformation: data.additionalInformation || '',
    postedDate: data.postedDate ? String(data.postedDate).split('T')[0] : '',
    status: data.status || 'DRAFT',
    applicants: typeof data.applicantCount === 'number' ? data.applicantCount : (data.applicants || 0),
    applicantCount: typeof data.applicantCount === 'number' ? data.applicantCount : (data.applicants || 0),
    recruiterEmail: data.recruiterEmail || '',
    recruiterId: data.recruiterId || null,
  };
};

/**
 * Maps Frontend Job model -> Backend DTO
 */
export const mapJobToBackend = (jobData, userOrEmail) => {
  const { email, id } = resolveRecruiterIdentity(userOrEmail);

  return {
    title: jobData.title || '',
    companyName: jobData.company || jobData.companyName || 'TechPulse Global Solutions',
    description: jobData.description || '',
    employmentType: jobData.employmentType || 'FULL_TIME',
    workMode: jobData.workMode || 'HYBRID',
    location: jobData.location || '',
    experience: jobData.experience || '',
    salary: jobData.salary || '',
    applicationDeadline: jobData.deadline || jobData.applicationDeadline || null,
    requiredSkills: Array.isArray(jobData.skills) ? jobData.skills : [],
    qualifications: Array.isArray(jobData.qualifications) ? jobData.qualifications : [],
    responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities : [],
    benefits: Array.isArray(jobData.benefits) ? jobData.benefits : [],
    additionalInformation: jobData.additionalInfo || jobData.additionalInformation || '',
    status: jobData.status || 'DRAFT',
    recruiterEmail: email,
    recruiterId: id,
  };
};

/**
 * Format API errors into user-friendly error messages
 */
export const formatErrorMessage = (error) => {
  if (!error.response) {
    return 'Unable to connect to the Job Service. Please check that the backend microservice is running on port 8083.';
  }
  const status = error.response.status;
  const data = error.response.data;

  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You are not authorized to perform this action.';
  if (status === 404) return data?.message || 'Job requisition not found.';
  if (status === 400) {
    if (data?.fieldErrors) {
      const firstErr = Object.values(data.fieldErrors)[0];
      return firstErr || data.message || 'Invalid job input parameters.';
    }
    return data?.message || 'Invalid input data provided.';
  }
  if (status === 500) return 'Something went wrong on the server. Please try again.';
  return data?.message || 'An unexpected error occurred.';
};

/**
 * Helper to construct headers with recruiter identity
 */
const getAuthHeaders = (userOrEmail) => {
  const { email, id } = resolveRecruiterIdentity(userOrEmail);
  const headers = {
    'X-Recruiter-Email': email,
  };
  if (id) headers['X-Recruiter-Id'] = String(id);
  return headers;
};

export const jobService = {
  /**
   * GET /jobs (Public active jobs for candidates)
   */
  async getJobs() {
    try {
      const response = await api.get('/jobs', {
        baseURL: JOB_SERVICE_BASE_URL,
      });
      return response.data.map(mapJobFromBackend);
    } catch (error) {
      console.warn('Job Service offline, returning empty active list:', error.message);
      return [];
    }
  },

  /**
   * GET /jobs/{id}
   */
  async getJobById(id, userOrEmail) {
    try {
      const response = await api.get(`/jobs/${id}`, {
        baseURL: JOB_SERVICE_BASE_URL,
        headers: getAuthHeaders(userOrEmail),
      });
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatErrorMessage(error));
      }
      // Fallback check mock dataset if backend not running during dev preview
      const localMock = getMockRecruiterJobById(id, userOrEmail);
      if (localMock) return localMock;
      throw new Error('Unable to connect to Job Service.');
    }
  },

  /**
   * GET /jobs/recruiter?email=...
   */
  async getRecruiterJobs(userOrEmail) {
    const { email } = resolveRecruiterIdentity(userOrEmail);
    try {
      const response = await api.get('/jobs/recruiter', {
        baseURL: JOB_SERVICE_BASE_URL,
        params: { email },
        headers: getAuthHeaders(userOrEmail),
      });
      return response.data.map(mapJobFromBackend);
    } catch (error) {
      console.warn('Job Service API call failed, using local mock data:', error.message);
      // Dev fallback to local mock data if Job Service is not running
      const mockJobs = getMockRecruiterJobs(userOrEmail);
      return mockJobs;
    }
  },

  /**
   * POST /jobs
   */
  async createJob(jobData, userOrEmail) {
    const payload = mapJobToBackend(jobData, userOrEmail);
    try {
      const response = await api.post('/jobs', payload, {
        baseURL: JOB_SERVICE_BASE_URL,
        headers: getAuthHeaders(userOrEmail),
      });
      // Also update mock storage for sync
      saveMockRecruiterJob(mapJobFromBackend(response.data), userOrEmail);
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatErrorMessage(error));
      }
      // Dev fallback
      const savedMock = saveMockRecruiterJob(jobData, userOrEmail);
      return savedMock;
    }
  },

  /**
   * PUT /jobs/{id}
   */
  async updateJob(id, jobData, userOrEmail) {
    const payload = mapJobToBackend(jobData, userOrEmail);
    try {
      const response = await api.put(`/jobs/${id}`, payload, {
        baseURL: JOB_SERVICE_BASE_URL,
        headers: getAuthHeaders(userOrEmail),
      });
      saveMockRecruiterJob(mapJobFromBackend(response.data), userOrEmail);
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatErrorMessage(error));
      }
      const savedMock = saveMockRecruiterJob({ ...jobData, id }, userOrEmail);
      return savedMock;
    }
  },

  /**
   * PATCH /jobs/{id}/publish
   */
  async publishJob(id, userOrEmail) {
    try {
      const response = await api.patch(`/jobs/${id}/publish`, null, {
        baseURL: JOB_SERVICE_BASE_URL,
        headers: getAuthHeaders(userOrEmail),
      });
      updateMockJobStatus(id, 'ACTIVE', userOrEmail);
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatErrorMessage(error));
      }
      updateMockJobStatus(id, 'ACTIVE', userOrEmail);
      return { id, status: 'ACTIVE' };
    }
  },

  /**
   * PATCH /jobs/{id}/close
   */
  async closeJob(id, userOrEmail) {
    try {
      const response = await api.patch(`/jobs/${id}/close`, null, {
        baseURL: JOB_SERVICE_BASE_URL,
        headers: getAuthHeaders(userOrEmail),
      });
      updateMockJobStatus(id, 'CLOSED', userOrEmail);
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatErrorMessage(error));
      }
      updateMockJobStatus(id, 'CLOSED', userOrEmail);
      return { id, status: 'CLOSED' };
    }
  },

  /**
   * DELETE /jobs/{id}
   */
  async deleteJob(id, userOrEmail) {
    try {
      await api.delete(`/jobs/${id}`, {
        baseURL: JOB_SERVICE_BASE_URL,
        headers: getAuthHeaders(userOrEmail),
      });
      deleteMockRecruiterJob(id, userOrEmail);
      return true;
    } catch (error) {
      if (error.response) {
        throw new Error(formatErrorMessage(error));
      }
      deleteMockRecruiterJob(id, userOrEmail);
      return true;
    }
  },
};

export default jobService;
