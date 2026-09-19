import {
  getAdminUsers as getMockUsers,
  getAdminUserById as getMockUserById,
  updateAdminUserStatus as updateMockUserStatus,
} from '../data/adminUsers';

import {
  getAdminActivities as getMockActivities,
  logAdminActivity,
} from '../data/adminActivity';

import { getSystemServices } from '../data/adminSystem';
import { getJobs } from '../data/jobs';
import { getRecruiterJobs } from '../data/recruiterJobs';
import { INITIAL_APPLICATIONS } from '../data/applications';
import { INITIAL_RECRUITER_APPLICANTS } from '../data/applicants';

/**
 * Admin Service Abstraction Layer (M3 Phase 2)
 * 
 * Future Microservice / API Gateway REST Contracts:
 * - User Management:
 *   - GET   /users
 *   - GET   /users/{id}
 *   - PATCH /users/{id}/status
 * 
 * - Platform Requisitions:
 *   - GET   /admin/jobs (or /jobs)
 * 
 * - Platform Applications:
 *   - GET   /admin/applications (or /applications)
 * 
 * - System Health & Platform Analytics:
 *   - GET   /admin/stats
 *   - GET   /system/health
 */
export const adminService = {
  /**
   * Fetch all registered platform users
   */
  async getUsers() {
    return getMockUsers();
  },

  /**
   * Fetch a single user record by ID
   */
  async getUserById(id) {
    const user = getMockUserById(id);
    if (!user) {
      throw new Error(`Platform user record #${id} was not found.`);
    }
    return user;
  },

  /**
   * Update account status (ACTIVE / INACTIVE)
   */
  async updateUserStatus(id, newStatus, adminUser) {
    const updated = updateMockUserStatus(id, newStatus);
    
    // Log platform activity event
    logAdminActivity({
      type: 'STATUS_CHANGED',
      title: `User Account ${newStatus === 'ACTIVE' ? 'Activated' : 'Deactivated'}`,
      description: `Account for ${updated.name} (${updated.email}) was set to ${newStatus}.`,
      entityName: updated.name,
      entityType: 'User Account',
      user: `${adminUser?.name || 'Administrator'} (Admin)`,
      badgeClass: newStatus === 'ACTIVE' ? 'badge-success' : 'badge-danger',
    });

    return updated;
  },

  /**
   * Fetch all platform job requisitions (combined active and recruiter requisitions)
   */
  async getAdminJobs() {
    // Combine base jobs with recruiter jobs for complete platform visibility
    const baseJobs = getJobs() || [];
    const recruiterJobs = getRecruiterJobs() || [];

    const jobMap = new Map();
    baseJobs.forEach((j) => jobMap.set(String(j.id), { ...j, status: j.status || 'ACTIVE' }));
    recruiterJobs.forEach((j) => {
      const existing = jobMap.get(String(j.id));
      jobMap.set(String(j.id), { ...existing, ...j });
    });

    return Array.from(jobMap.values());
  },

  /**
   * Fetch platform-wide application submissions
   */
  async getAdminApplications() {
    // Map initial job seeker and recruiter mock applications into unified admin model
    const appMap = new Map();

    (INITIAL_APPLICATIONS || []).forEach((app) => {
      appMap.set(String(app.id), {
        id: app.id,
        candidateName: app.candidateName || 'Alex Morgan',
        candidateEmail: app.candidateEmail || 'seeker@talentpulse.com',
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        companyName: app.companyName || app.company || 'TalentPulse Enterprise',
        recruiter: 'Marcus Vance',
        appliedDate: app.appliedDate,
        lastUpdated: app.lastUpdated || app.appliedDate,
        status: (app.status || 'APPLIED').toUpperCase().replace(/\s+/g, '_'),
        resumeName: app.resume?.fileName || app.resumeName || 'Resume.pdf',
      });
    });

    (INITIAL_RECRUITER_APPLICANTS || []).forEach((app) => {
      if (!appMap.has(String(app.id))) {
        appMap.set(String(app.id), {
          id: app.id,
          candidateName: app.candidate?.fullName || 'Candidate',
          candidateEmail: app.candidate?.email || 'candidate@example.com',
          jobId: app.jobId,
          jobTitle: app.jobTitle,
          companyName: app.company || 'TechPulse Global Solutions',
          recruiter: app.recruiterEmail || 'recruiter@talentpulse.com',
          appliedDate: app.appliedDate,
          lastUpdated: app.appliedDate,
          status: (app.status || 'APPLIED').toUpperCase().replace(/\s+/g, '_'),
          resumeName: app.resume?.fileName || 'Resume.pdf',
        });
      }
    });

    return Array.from(appMap.values());
  },

  /**
   * Calculate aggregated platform analytics & statistics
   */
  async getPlatformStats() {
    const users = getMockUsers();
    const jobs = await this.getAdminJobs();
    const applications = await this.getAdminApplications();
    const services = getSystemServices();

    // User breakdown
    const jobSeekersCount = users.filter((u) => u.role === 'JOB_SEEKER').length;
    const recruitersCount = users.filter((u) => u.role === 'RECRUITER').length;
    const adminsCount = users.filter((u) => u.role === 'ADMIN').length;
    const activeUsersCount = users.filter((u) => u.status === 'ACTIVE').length;
    const inactiveUsersCount = users.filter((u) => u.status === 'INACTIVE').length;

    // Jobs breakdown
    const activeJobsCount = jobs.filter((j) => (j.status || 'ACTIVE').toUpperCase() === 'ACTIVE').length;
    const draftJobsCount = jobs.filter((j) => (j.status || '').toUpperCase() === 'DRAFT').length;
    const closedJobsCount = jobs.filter((j) => (j.status || '').toUpperCase() === 'CLOSED').length;

    // Applications breakdown
    const appliedCount = applications.filter((a) => a.status === 'APPLIED').length;
    const underReviewCount = applications.filter((a) => a.status === 'UNDER_REVIEW').length;
    const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
    const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;
    const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

    // Microservices status
    const onlineServicesCount = services.filter((s) => s.status === 'ONLINE').length;

    return {
      totalUsers: users.length,
      jobSeekersCount,
      recruitersCount,
      adminsCount,
      activeUsersCount,
      inactiveUsersCount,

      totalJobs: jobs.length,
      activeJobsCount,
      draftJobsCount,
      closedJobsCount,

      totalApplications: applications.length,
      appliedCount,
      underReviewCount,
      shortlistedCount,
      selectedCount,
      rejectedCount,

      totalServices: services.length,
      onlineServicesCount,
    };
  },

  /**
   * Fetch recent platform audit & activity stream
   */
  async getRecentActivities() {
    return getMockActivities();
  },

  /**
   * Fetch microservice architecture specifications
   */
  async getSystemOverview() {
    return getSystemServices();
  },
};

export default adminService;
