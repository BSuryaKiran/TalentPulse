import {
  getRecruiterApplicants as getMockApplicants,
  getApplicantById as getMockApplicantById,
  updateApplicantStatus as updateMockStatus,
  getApplicantsByJobId as getMockApplicantsByJobId,
} from '../data/applicants';

export const applicationService = {
  /**
   * Fetch recruiter applicants (Simulated frontend boundary for future GET /applications/recruiter)
   */
  async getRecruiterApplicants(userOrEmail) {
    // In Phase 5, returns scoped mock application records
    return getMockApplicants(userOrEmail);
  },

  /**
   * Fetch applicant by ID (Simulated frontend boundary for future GET /applications/{id})
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
