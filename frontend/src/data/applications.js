// Mock Applications Data for Job Seeker Frontend (Phase 2)
// Structured for future Application Service integration

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-501',
    jobId: 'job-101',
    jobTitle: 'Senior React Developer',
    company: 'CloudPulse Technologies',
    location: 'San Francisco, CA',
    employmentType: 'Full Time',
    appliedDate: '2026-03-04',
    status: 'UNDER REVIEW',
    lastUpdated: '2026-03-10',
    resumeName: 'Resume_Frontend_Engineer.pdf',
    notes: 'Cover letter submitted with portfolio reference.',
  },
  {
    id: 'app-502',
    jobId: 'job-103',
    jobTitle: 'Software Engineer - Full Stack',
    company: 'NexGen Software Solutions',
    location: 'Austin, TX',
    employmentType: 'Full Time',
    appliedDate: '2026-03-07',
    status: 'SHORTLISTED',
    lastUpdated: '2026-03-12',
    resumeName: 'Resume_FullStack.pdf',
    notes: 'Invited for technical interview screening.',
  },
  {
    id: 'app-503',
    jobId: 'job-104',
    jobTitle: 'Data Analyst & Insights Specialist',
    company: 'DataFlex Analytics',
    location: 'Chicago, IL',
    employmentType: 'Full Time',
    appliedDate: '2026-03-09',
    status: 'APPLIED',
    lastUpdated: '2026-03-09',
    resumeName: 'Resume_DataAnalyst.pdf',
    notes: 'Application received and queued for review.',
  },
  {
    id: 'app-504',
    jobId: 'job-107',
    jobTitle: 'UI/UX Frontend Developer',
    company: 'Aura AI Labs',
    location: 'Boston, MA',
    employmentType: 'Contract',
    appliedDate: '2026-02-28',
    status: 'SELECTED',
    lastUpdated: '2026-03-14',
    resumeName: 'Resume_UIUX.pdf',
    notes: 'Offer letter extended to candidate.',
  },
];

export const getApplications = () => {
  const stored = localStorage.getItem('tp_mock_applications');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_APPLICATIONS;
    }
  }
  localStorage.setItem('tp_mock_applications', JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
};

export const addApplication = (applicationData) => {
  const currentApps = getApplications();
  const newApp = {
    id: 'app-' + Date.now(),
    appliedDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    status: 'APPLIED',
    ...applicationData,
  };

  const updated = [newApp, ...currentApps];
  localStorage.setItem('tp_mock_applications', JSON.stringify(updated));
  return newApp;
};

export const hasUserApplied = (jobId) => {
  const currentApps = getApplications();
  return currentApps.some((app) => app.jobId === jobId);
};
