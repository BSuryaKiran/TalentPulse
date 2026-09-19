import {
  getRecruiterApplicants as getMockApplicants,
  getApplicantById as getMockApplicantById,
  updateApplicantStatus as updateMockStatus,
  getApplicantsByJobId as getMockApplicantsByJobId,
} from '../data/applicants';

import {
  getApplications as getMockJobSeekerApplications,
  getApplicationById as getMockJobSeekerApplicationById,
  addApplication as addMockJobSeekerApplication,
  hasUserApplied as checkMockUserApplied,
  getApplicationByJobId as getMockApplicationByJobId,
} from '../data/applications';

/**
 * Application Service Abstraction Layer
 * 
 * Future Microservice REST API Endpoints:
 * - Candidate Applications:
 *   - GET  /applications/candidate/{candidateId} (or /applications/my)
 *   - GET  /applications/{id}
 *   - POST /applications
 * 
 * - Recruiter Applicant Tracking:
 *   - GET   /applications/recruiter/{recruiterId}
 *   - GET   /applications/job/{jobId}
 *   - PATCH /applications/{id}/status
 */
export const applicationService = {
  // =========================================================================
  // JOB SEEKER METHODS (M3 Phase 1)
  // =========================================================================

  /**
   * Fetch all applications for the authenticated job seeker
   * (Simulated frontend boundary for future GET /applications/candidate/{candidateId})
   */
  async getMyApplications(userOrEmail) {
    // In Phase 1 mock mode, returns user-scoped applications from localStorage
    return getMockJobSeekerApplications(userOrEmail);
  },

  /**
   * Fetch a single application record by ID for a job seeker
   * (Simulated frontend boundary for future GET /applications/{id})
   */
  async getApplicationById(id, userOrEmail) {
    const application = getMockJobSeekerApplicationById(id, userOrEmail);
    if (!application) {
      throw new Error(`Application record with ID #${id} was not found.`);
    }
    return application;
  },

  /**
   * Check if the authenticated job seeker has already applied to a job
   */
  async hasUserApplied(jobId, userOrEmail) {
    return checkMockUserApplied(jobId, userOrEmail);
  },

  /**
   * Get an application for a specific job ID
   */
  async getApplicationByJobId(jobId, userOrEmail) {
    return getMockApplicationByJobId(jobId, userOrEmail);
  },

  /**
   * Submit a new job application
   * (Simulated frontend boundary for future POST /applications)
   */
  async createApplication(applicationData, userOrEmail) {
    if (!applicationData.jobId) {
      throw new Error('Valid Job ID is required to submit an application.');
    }
    return addMockJobSeekerApplication(applicationData, userOrEmail);
  },

  // =========================================================================
  // RECRUITER METHODS (M2 Phase 5 integration)
  // =========================================================================

  /**
   * Fetch recruiter applicants (Simulated frontend boundary for future GET /applications/recruiter)
   */
  async getRecruiterApplicants(userOrEmail) {
    return getMockApplicants(userOrEmail);
  },

  /**
   * Fetch applicant by ID for recruiter view (Simulated frontend boundary for future GET /applications/{id})
   */
  async getApplicantById(id, userOrEmail) {
    const applicant = getMockApplicantById(id, userOrEmail);
    if (!applicant) {
      throw new Error(`Applicant record with ID ${id} not found.`);
    }
    return applicant;
  },

  /**
   * Fetch applicants for a specific job requisition (Simulated GET /applications/job/{jobId})
   */
  async getApplicantsByJob(jobId, userOrEmail) {
    return getMockApplicantsByJobId(jobId, userOrEmail);
  },

  /**
   * Update applicant status (Simulated PATCH /applications/{id}/status)
   */
  async updateStatus(id, newStatus, userOrEmail) {
    const updated = updateMockStatus(id, newStatus, userOrEmail);
    if (!updated) {
      throw new Error(`Failed to update status for applicant ID ${id}.`);
    }
    return updated;
  },
};

export default applicationService;
