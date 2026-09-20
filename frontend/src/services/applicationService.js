import api, { formatApiError } from './api';
import {
  getRecruiterApplicants as getMockApplicants,
  getApplicantById as getMockApplicantById,
  updateApplicantStatus as updateMockStatus,
  getApplicantsByJobId as getMockApplicantsByJobId,
  INITIAL_RECRUITER_APPLICANTS,
} from '../data/applicants';

import {
  getApplications as getMockJobSeekerApplications,
  getApplicationById as getMockJobSeekerApplicationById,
  addApplication as addMockJobSeekerApplication,
  hasUserApplied as checkMockUserApplied,
  getApplicationByJobId as getMockApplicationByJobId,
} from '../data/applications';

/**
 * Resolve candidate identity from Auth context / localStorage
 */
const resolveCandidateIdentity = (userOrEmail) => {
  let email = '';
  let id = 1;
  let name = '';

  if (typeof userOrEmail === 'string') {
    email = userOrEmail.trim();
  } else if (userOrEmail && typeof userOrEmail === 'object') {
    email = userOrEmail.email || '';
    id = Number(userOrEmail.id) || 1;
    name = userOrEmail.name || userOrEmail.fullName || '';
  }

  if (!email) {
    try {
      const stored = localStorage.getItem('tp_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        email = parsed?.email || '';
        id = Number(parsed?.id) || 1;
        name = parsed?.name || '';
      }
    } catch {
      // ignore
    }
  }

  return {
    email: email || 'seeker@talentpulse.com',
    id: id || 1,
    name: name || 'Candidate',
  };
};

/**
 * Resolve recruiter identity
 */
const resolveRecruiterIdentity = (userOrEmail) => {
  let email = '';
  let id = 2;

  if (typeof userOrEmail === 'string') {
    email = userOrEmail.trim();
  } else if (userOrEmail && typeof userOrEmail === 'object') {
    email = userOrEmail.email || '';
    id = Number(userOrEmail.id) || 2;
  }

  if (!email) {
    try {
      const stored = localStorage.getItem('tp_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        email = parsed?.email || '';
        id = Number(parsed?.id) || 2;
      }
    } catch {
      // ignore
    }
  }

  return {
    email: email || 'recruiter@talentpulse.com',
    id: id || 2,
  };
};

/**
 * Map backend ApplicationResponse to frontend model
 */
export const mapApplicationFromBackend = (data) => {
  if (!data) return null;
  const appliedDateStr = data.appliedDate
    ? String(data.appliedDate).split('T')[0]
    : new Date().toISOString().split('T')[0];

  const statusVal = data.status || 'APPLIED';

  return {
    id: String(data.id),
    jobId: String(data.jobId),
    jobTitle: data.jobTitle || 'Software Position',
    company: data.companyName || 'TalentPulse Enterprise',
    companyName: data.companyName || 'TalentPulse Enterprise',
    candidateId: data.candidateId ? String(data.candidateId) : '1',
    candidateEmail: data.candidateEmail || '',
    candidateName: data.candidateName || 'Candidate',
    recruiterId: data.recruiterId,
    recruiterEmail: data.recruiterEmail,
    appliedDate: appliedDateStr,
    lastUpdated: appliedDateStr,
    status: statusVal,
    resumeName: data.resumeReference || 'Candidate_Resume.pdf',
    resume: {
      fileName: data.resumeReference || 'Candidate_Resume.pdf',
      fileSize: '1.2 MB',
      lastUploaded: appliedDateStr,
    },
    coverLetter: data.coverLetter || '',
    notes: data.notes || data.coverLetter || '',
    location: 'San Francisco, CA (Remote)',
    employmentType: 'Full Time',
    workMode: 'Remote',
    experience: '2–5 Years',
    salary: '$110,000 - $140,000',
    // Structure used by recruiter applicant cards
    candidate: {
      fullName: data.candidateName || 'Candidate',
      email: data.candidateEmail || '',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      skills: ['React', 'JavaScript', 'Spring Boot', 'SQL', 'REST APIs'],
      experience: '3+ Years',
      currentRole: 'Software Engineer',
    },
  };
};

export const applicationService = {
  // =========================================================================
  // JOB SEEKER METHODS
  // =========================================================================

  /**
   * Fetch all applications for the authenticated job seeker via API Gateway
   */
  async getMyApplications(userOrEmail) {
    const { email, id } = resolveCandidateIdentity(userOrEmail);
    try {
      const response = await api.get('/applications/candidate', {
        params: { email, candidateId: id },
        headers: {
          'X-Candidate-Email': email,
          'X-Candidate-Id': String(id),
        },
      });

      if (Array.isArray(response.data)) {
        return response.data.map(mapApplicationFromBackend);
      }
      return getMockJobSeekerApplications(userOrEmail);
    } catch (error) {
      console.warn('Application Service /applications/candidate unreachable, using fallback:', error.message);
      return getMockJobSeekerApplications(userOrEmail);
    }
  },

  /**
   * Fetch a single application record by ID for a job seeker
   */
  async getApplicationById(id, userOrEmail) {
    try {
      const response = await api.get(`/applications/${id}`);
      return mapApplicationFromBackend(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(formatApiError(error, `Application #${id} not found.`));
      }
      const localMock = getMockJobSeekerApplicationById(id, userOrEmail);
      if (localMock) return localMock;
      const recMock = getMockApplicantById(id, userOrEmail);
      if (recMock) return recMock;
      throw new Error(formatApiError(error, `Application record #${id} not found.`));
    }
  },

  /**
   * Check if the authenticated job seeker has already applied to a job
   */
  async hasUserApplied(jobId, userOrEmail) {
    try {
      const apps = await this.getMyApplications(userOrEmail);
      return apps.some((app) => String(app.jobId) === String(jobId));
    } catch {
      return checkMockUserApplied(jobId, userOrEmail);
    }
  },

  /**
   * Get an application for a specific job ID
   */
  async getApplicationByJobId(jobId, userOrEmail) {
    try {
      const apps = await this.getMyApplications(userOrEmail);
      return apps.find((app) => String(app.jobId) === String(jobId)) || null;
    } catch {
      return getMockApplicationByJobId(jobId, userOrEmail);
    }
  },

  /**
   * Submit a new job application via API Gateway
   */
  async createApplication(applicationData, userOrEmail) {
    if (!applicationData.jobId) {
      throw new Error('Valid Job ID is required to submit an application.');
    }

    const { email, id, name } = resolveCandidateIdentity(userOrEmail);

    const payload = {
      jobId: Number(applicationData.jobId) || 1,
      jobTitle: applicationData.jobTitle || 'Software Position',
      companyName: applicationData.companyName || applicationData.company || 'TalentPulse Enterprise',
      candidateId: Number(id) || 1,
      candidateEmail: email,
      candidateName: applicationData.candidateName || name || 'Candidate',
      recruiterId: applicationData.recruiterId ? Number(applicationData.recruiterId) : null,
      recruiterEmail: applicationData.recruiterEmail || null,
      resumeReference:
        applicationData.resumeName ||
        applicationData.resume?.fileName ||
        `${name.replace(/\s+/g, '_')}_Resume_2026.pdf`,
      coverLetter: applicationData.coverLetter || applicationData.notes || '',
      notes: applicationData.notes || applicationData.coverLetter || 'Submitted via TalentPulse portal.',
    };

    try {
      const response = await api.post('/applications', payload, {
        headers: {
          'X-Candidate-Email': email,
          'X-Candidate-Id': String(id),
        },
      });

      const mapped = mapApplicationFromBackend(response.data);
      // Sync local mock storage as well
      addMockJobSeekerApplication(mapped, email);
      return mapped;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          throw new Error('You have already applied for this job.');
        }
        throw new Error(formatApiError(error, 'Failed to submit application.'));
      }
      // Dev offline fallback
      const savedMock = addMockJobSeekerApplication(applicationData, email);
      return savedMock;
    }
  },

  // =========================================================================
  // RECRUITER METHODS
  // =========================================================================

  /**
   * Fetch recruiter applicants via API Gateway
   */
  async getRecruiterApplicants(userOrEmail) {
    const { email, id } = resolveRecruiterIdentity(userOrEmail);
    try {
      const response = await api.get('/applications/recruiter', {
        params: { email, recruiterId: id },
        headers: {
          'X-Recruiter-Email': email,
          'X-Recruiter-Id': String(id),
        },
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map(mapApplicationFromBackend);
      }
      // If backend DB is empty, use initial recruiter applicants
      return (INITIAL_RECRUITER_APPLICANTS || []).map(mapApplicationFromBackend);
    } catch (error) {
      console.warn('Application Service /applications/recruiter unreachable, using mock data:', error.message);
      return getMockApplicants(userOrEmail);
    }
  },

  /**
   * Fetch applicant by ID for recruiter view
   */
  async getApplicantById(id, userOrEmail) {
    try {
      const response = await api.get(`/applications/${id}`);
      return mapApplicationFromBackend(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(formatApiError(error, `Applicant record #${id} not found.`));
      }
      const localMock = getMockApplicantById(id, userOrEmail);
      if (localMock) return localMock;
      throw new Error(formatApiError(error, `Applicant record #${id} not found.`));
    }
  },

  /**
   * Fetch applicants for a specific job requisition
   */
  async getApplicantsByJob(jobId, userOrEmail) {
    try {
      const response = await api.get(`/applications/job/${jobId}`);
      if (Array.isArray(response.data)) {
        return response.data.map(mapApplicationFromBackend);
      }
      return getMockApplicantsByJobId(jobId, userOrEmail);
    } catch (error) {
      console.warn(`Application Service /applications/job/${jobId} failed, using fallback:`, error.message);
      return getMockApplicantsByJobId(jobId, userOrEmail);
    }
  },

  /**
   * Update applicant status via API Gateway
   */
  async updateStatus(id, newStatus, userOrEmail) {
    const { email, id: recruiterId } = resolveRecruiterIdentity(userOrEmail);
    const normalizedStatus = String(newStatus).toUpperCase().replace(/\s+/g, '_');

    try {
      const response = await api.patch(
        `/applications/${id}/status`,
        {
          status: normalizedStatus,
          recruiterNotes: `Status updated to ${normalizedStatus} by ${email}`,
        },
        {
          headers: {
            'X-Recruiter-Email': email,
            'X-Recruiter-Id': String(recruiterId),
          },
        }
      );

      const mapped = mapApplicationFromBackend(response.data);
      updateMockStatus(id, normalizedStatus, userOrEmail);
      return mapped;
    } catch (error) {
      if (error.response) {
        throw new Error(formatApiError(error, 'Failed to update applicant status on server.'));
      }
      const updated = updateMockStatus(id, normalizedStatus, userOrEmail);
      if (!updated) {
        throw new Error(`Failed to update status for applicant #${id}.`);
      }
      return updated;
    }
  },
};

export default applicationService;

