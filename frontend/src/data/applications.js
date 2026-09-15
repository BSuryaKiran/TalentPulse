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

const resolveUserEmail = (userEmail) => {
  if (userEmail && typeof userEmail === 'string') {
    return userEmail.toLowerCase().trim();
  }
  try {
    const storedUser = localStorage.getItem('tp_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?.email) return parsed.email.toLowerCase().trim();
    }
  } catch {
    // ignore
  }
  return 'seeker@talentpulse.com';
};

const getStorageKey = (email) => `tp_apps_${email}`;

export const getApplications = (userEmail) => {
  const email = resolveUserEmail(userEmail);
  const isDemo = email === 'seeker@talentpulse.com' || email.includes('demo');
  const storageKey = getStorageKey(email);

  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return isDemo ? INITIAL_APPLICATIONS : [];
    }
  }

  // Demo user gets initial mock applications; new signups start with empty applications list
  const initialData = isDemo ? INITIAL_APPLICATIONS : [];
  localStorage.setItem(storageKey, JSON.stringify(initialData));
  return initialData;
};

export const addApplication = (applicationData, userEmail) => {
  const email = resolveUserEmail(userEmail);
  const storageKey = getStorageKey(email);
  const currentApps = getApplications(email);

  const newApp = {
    id: 'app-' + Date.now(),
    appliedDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    status: 'APPLIED',
    ...applicationData,
  };

  const updated = [newApp, ...currentApps];
  localStorage.setItem(storageKey, JSON.stringify(updated));
  return newApp;
};

export const hasUserApplied = (jobId, userEmail) => {
  const email = resolveUserEmail(userEmail);
  const currentApps = getApplications(email);
  return currentApps.some((app) => app.jobId === jobId);
};

