import api, { formatApiError } from './api';
import {
  getRecruiterJobs as getMockRecruiterJobs,
  getRecruiterJobById as getMockRecruiterJobById,
  saveRecruiterJob as saveMockRecruiterJob,
  deleteRecruiterJob as deleteMockRecruiterJob,
  updateJobStatus as updateMockJobStatus,
} from '../data/recruiterJobs';
import { INITIAL_JOBS } from '../data/jobs';

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
    experienceLevel: data.experience || '2–5 Years',
    salary: data.salary || '',
    salaryRange: data.salary || '',
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
   * GET /jobs (Public active jobs for candidates via API Gateway)
   */
  async getJobs() {
    try {
      const response = await api.get('/jobs');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map(mapJobFromBackend);
      }
      // If backend database is empty in dev, return initial default jobs
      return (INITIAL_JOBS || []).map(mapJobFromBackend);
    } catch (error) {
      console.warn('Job Service API unreachable via Gateway, using local fallback:', error.message);
      return (INITIAL_JOBS || []).map(mapJobFromBackend);
    }
  },

  /**
   * GET /jobs/all (Admin / platform-wide jobs via API Gateway)
   */
  async getAllJobs() {
    try {
      const response = await api.get('/jobs/all');
      return response.data.map(mapJobFromBackend);
    } catch (error) {
      console.warn('Job Service /jobs/all call failed, using fallback:', error.message);
      return (INITIAL_JOBS || []).map(mapJobFromBackend);
    }
  },

  /**
   * GET /jobs/{id}
   */
  async getJobById(id, userOrEmail) {
    try {
      const response = await api.get(`/jobs/${id}`, {
        headers: getAuthHeaders(userOrEmail),
      });
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatApiError(error, 'Job requisition not found.'));
      }
      // Fallback check mock dataset if backend not running during dev preview
      const localMock = getMockRecruiterJobById(id, userOrEmail);
      if (localMock) return localMock;
      const initialMatch = (INITIAL_JOBS || []).find((j) => String(j.id) === String(id));
      if (initialMatch) return mapJobFromBackend(initialMatch);
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
        params: { email },
        headers: getAuthHeaders(userOrEmail),
      });
      return response.data.map(mapJobFromBackend);
    } catch (error) {
      console.warn('Job Service API call failed, using local mock data:', error.message);
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
        headers: getAuthHeaders(userOrEmail),
      });
      saveMockRecruiterJob(mapJobFromBackend(response.data), userOrEmail);
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatApiError(error, 'Failed to create job requisition.'));
      }
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
        headers: getAuthHeaders(userOrEmail),
      });
      saveMockRecruiterJob(mapJobFromBackend(response.data), userOrEmail);
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatApiError(error, 'Failed to update job requisition.'));
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
        headers: getAuthHeaders(userOrEmail),
      });
      updateMockJobStatus(id, 'ACTIVE', userOrEmail);
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatApiError(error, 'Failed to publish job requisition.'));
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
        headers: getAuthHeaders(userOrEmail),
      });
      updateMockJobStatus(id, 'CLOSED', userOrEmail);
      return mapJobFromBackend(response.data);
    } catch (error) {
      if (error.response) {
        throw new Error(formatApiError(error, 'Failed to close job requisition.'));
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
        headers: getAuthHeaders(userOrEmail),
      });
      deleteMockRecruiterJob(id, userOrEmail);
      return true;
    } catch (error) {
      if (error.response) {
        throw new Error(formatApiError(error, 'Failed to delete job requisition.'));
      }
      deleteMockRecruiterJob(id, userOrEmail);
      return true;
    }
  },
};

export default jobService;

