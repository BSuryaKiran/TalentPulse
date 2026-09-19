// Mock Applications Data for Job Seeker Frontend (M3 Phase 1)
// Structured for future microservices Application Service integration

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-501',
    jobId: 'job-101',
    jobTitle: 'Senior React Developer',
    companyName: 'CloudPulse Technologies',
    company: 'CloudPulse Technologies',
    candidateId: 'cand-101',
    candidateEmail: 'seeker@talentpulse.com',
    candidateName: 'Alex Morgan',
    location: 'San Francisco, CA',
    employmentType: 'Full Time',
    workMode: 'Remote',
    experience: '2–5 Years',
    salary: '$110,000 - $140,000',
    appliedDate: '2026-03-04',
    status: 'UNDER_REVIEW',
    lastUpdated: '2026-03-10',
    resume: {
      fileName: 'Alex_Morgan_Resume_2026.pdf',
      fileSize: '1.2 MB',
      lastUploaded: '2026-03-01',
    },
    resumeName: 'Alex_Morgan_Resume_2026.pdf',
    coverLetter: 'I am excited to apply for the Senior React Developer role at CloudPulse Technologies. With 4+ years building high-throughput enterprise React web portals and design systems, I can make an immediate contribution.',
    notes: 'Cover letter submitted with portfolio reference.',
    timeline: [
      {
        status: 'APPLIED',
        title: 'Application Submitted',
        description: 'Your application was received and queued for review.',
        date: '2026-03-04',
      },
      {
        status: 'UNDER_REVIEW',
        title: 'Application Under Review',
        description: 'Recruitment team is screening qualifications and technical fit.',
        date: '2026-03-10',
      },
    ],
  },
  {
    id: 'app-502',
    jobId: 'job-103',
    jobTitle: 'Software Engineer - Full Stack',
    companyName: 'NexGen Software Solutions',
    company: 'NexGen Software Solutions',
    candidateId: 'cand-101',
    candidateEmail: 'seeker@talentpulse.com',
    candidateName: 'Alex Morgan',
    location: 'Austin, TX',
    employmentType: 'Full Time',
    workMode: 'Remote',
    experience: '0–2 Years',
    salary: '$85,000 - $105,000',
    appliedDate: '2026-03-07',
    status: 'SHORTLISTED',
    lastUpdated: '2026-03-12',
    resume: {
      fileName: 'Alex_Morgan_FullStack_Resume.pdf',
      fileSize: '1.4 MB',
      lastUploaded: '2026-03-02',
    },
    resumeName: 'Alex_Morgan_FullStack_Resume.pdf',
    coverLetter: 'Strong hands-on experience in modern React frontend components and Node/Java backend API integration.',
    notes: 'Invited for technical interview screening.',
    timeline: [
      {
        status: 'APPLIED',
        title: 'Application Submitted',
        description: 'Application successfully logged into portal.',
        date: '2026-03-07',
      },
      {
        status: 'UNDER_REVIEW',
        title: 'Profile Screened',
        description: 'Passed initial recruiter screening.',
        date: '2026-03-09',
      },
      {
        status: 'SHORTLISTED',
        title: 'Shortlisted for Interview',
        description: 'Selected for technical interview round with hiring team.',
        date: '2026-03-12',
      },
    ],
  },
  {
    id: 'app-503',
    jobId: 'job-104',
    jobTitle: 'Data Analyst & Insights Specialist',
    companyName: 'DataFlex Analytics',
    company: 'DataFlex Analytics',
    candidateId: 'cand-101',
    candidateEmail: 'seeker@talentpulse.com',
    candidateName: 'Alex Morgan',
    location: 'Chicago, IL',
    employmentType: 'Full Time',
    workMode: 'Remote',
    experience: '0–2 Years',
    salary: '$75,000 - $95,000',
    appliedDate: '2026-03-09',
    status: 'APPLIED',
    lastUpdated: '2026-03-09',
    resume: {
      fileName: 'Alex_Morgan_Analytics.pdf',
      fileSize: '1.1 MB',
      lastUploaded: '2026-03-05',
    },
    resumeName: 'Alex_Morgan_Analytics.pdf',
    coverLetter: 'Passionate about turning raw datasets into actionable enterprise intelligence with SQL and Python visualizations.',
    notes: 'Application received and queued for review.',
    timeline: [
      {
        status: 'APPLIED',
        title: 'Application Submitted',
        description: 'Application received by DataFlex Analytics talent team.',
        date: '2026-03-09',
      },
    ],
  },
  {
    id: 'app-504',
    jobId: 'job-107',
    jobTitle: 'UI/UX Frontend Developer',
    companyName: 'Aura AI Labs',
    company: 'Aura AI Labs',
    candidateId: 'cand-101',
    candidateEmail: 'seeker@talentpulse.com',
    candidateName: 'Alex Morgan',
    location: 'Boston, MA',
    employmentType: 'Contract',
    workMode: 'Remote',
    experience: '2–5 Years',
    salary: '$60 - $80 / hour',
    appliedDate: '2026-02-28',
    status: 'SELECTED',
    lastUpdated: '2026-03-14',
    resume: {
      fileName: 'Alex_Morgan_UIUX_Portfolio.pdf',
      fileSize: '2.0 MB',
      lastUploaded: '2026-02-25',
    },
    resumeName: 'Alex_Morgan_UIUX_Portfolio.pdf',
    coverLetter: 'Specialized in Figma-to-React component architectures and micro-interactions.',
    notes: 'Offer letter extended to candidate.',
    timeline: [
      {
        status: 'APPLIED',
        title: 'Application Submitted',
        description: 'Application submitted for UI/UX Frontend Developer requisition.',
        date: '2026-02-28',
      },
      {
        status: 'UNDER_REVIEW',
        title: 'Portfolio Review',
        description: 'Design system portfolio reviewed by lead architect.',
        date: '2026-03-03',
      },
      {
        status: 'SHORTLISTED',
        title: 'Shortlisted for Final Round',
        description: 'Completed final design presentation interview.',
        date: '2026-03-08',
      },
      {
        status: 'SELECTED',
        title: 'Candidate Selected',
        description: 'Congratulations! Official offer extended by Aura AI Labs.',
        date: '2026-03-14',
      },
    ],
  },
];

const resolveUserEmail = (userOrEmail) => {
  let email = '';
  if (typeof userOrEmail === 'string') {
    email = userOrEmail.toLowerCase().trim();
  } else if (userOrEmail && typeof userOrEmail === 'object') {
    email = (userOrEmail.email || '').toLowerCase().trim();
  }

  if (!email) {
    try {
      const storedUser = localStorage.getItem('tp_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        email = (parsed?.email || '').toLowerCase().trim();
      }
    } catch {
      // ignore
    }
  }

  return email || 'seeker@talentpulse.com';
};

const getStorageKey = (email) => `tp_apps_${email}`;

/**
 * Standardize status representation (e.g. 'UNDER REVIEW' -> 'UNDER_REVIEW')
 */
export const normalizeStatus = (status) => {
  if (!status) return 'APPLIED';
  const upper = String(status).toUpperCase().trim();
  if (upper === 'UNDER REVIEW') return 'UNDER_REVIEW';
  return upper;
};

/**
 * Get all applications for a specific job seeker
 */
export const getApplications = (userOrEmail) => {
  const email = resolveUserEmail(userOrEmail);
  const isDemo = email === 'seeker@talentpulse.com' || email.includes('demo');
  const storageKey = getStorageKey(email);

  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Normalize statuses on load
      return parsed.map((app) => ({
        ...app,
        status: normalizeStatus(app.status),
      }));
    } catch {
      return isDemo ? INITIAL_APPLICATIONS : [];
    }
  }

  // Demo user gets initial mock applications; new signups start with empty applications list
  const initialData = isDemo ? INITIAL_APPLICATIONS : [];
  localStorage.setItem(storageKey, JSON.stringify(initialData));
  return initialData;
};

/**
 * Get application by ID for a specific job seeker
 */
export const getApplicationById = (id, userOrEmail) => {
  const apps = getApplications(userOrEmail);
  return apps.find((app) => String(app.id) === String(id)) || null;
};

/**
 * Check if candidate already has an application for this job
 */
export const hasUserApplied = (jobId, userOrEmail) => {
  if (!jobId) return false;
  const currentApps = getApplications(userOrEmail);
  return currentApps.some((app) => String(app.jobId) === String(jobId));
};

/**
 * Get application by Job ID for a specific job seeker
 */
export const getApplicationByJobId = (jobId, userOrEmail) => {
  if (!jobId) return null;
  const currentApps = getApplications(userOrEmail);
  return currentApps.find((app) => String(app.jobId) === String(jobId)) || null;
};

/**
 * Add a new application for a job seeker
 */
export const addApplication = (applicationData, userOrEmail) => {
  const email = resolveUserEmail(userOrEmail);
  const storageKey = getStorageKey(email);
  const currentApps = getApplications(email);

  // Prevent duplicate application
  if (hasUserApplied(applicationData.jobId, email)) {
    throw new Error('You have already applied for this job.');
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const appId = 'app-' + Date.now();

  const resumeObj = applicationData.resume || {
    fileName: applicationData.resumeName || 'Candidate_Resume.pdf',
    fileSize: '1.2 MB',
    lastUploaded: todayStr,
  };

  const newApp = {
    id: appId,
    jobId: String(applicationData.jobId),
    jobTitle: applicationData.jobTitle || 'Position Requisition',
    companyName: applicationData.companyName || applicationData.company || 'TalentPulse Enterprise',
    company: applicationData.companyName || applicationData.company || 'TalentPulse Enterprise',
    candidateId: applicationData.candidateId || 'cand-' + Math.floor(Math.random() * 1000),
    candidateEmail: email,
    candidateName: applicationData.candidateName || 'Candidate',
    location: applicationData.location || 'Remote / Multiple Locations',
    employmentType: applicationData.employmentType || 'Full Time',
    workMode: applicationData.workMode || 'Hybrid',
    experience: applicationData.experience || applicationData.experienceLevel || 'Not Specified',
    salary: applicationData.salary || applicationData.salaryRange || 'Competitive',
    appliedDate: todayStr,
    lastUpdated: todayStr,
    status: 'APPLIED',
    resume: resumeObj,
    resumeName: resumeObj.fileName,
    coverLetter: applicationData.coverLetter || applicationData.notes || '',
    notes: applicationData.notes || applicationData.coverLetter || 'Application submitted via TalentPulse portal.',
    timeline: [
      {
        status: 'APPLIED',
        title: 'Application Submitted',
        description: 'Your application was received and logged into the enterprise hiring pipeline.',
        date: todayStr,
      },
    ],
  };

  const updated = [newApp, ...currentApps];
  localStorage.setItem(storageKey, JSON.stringify(updated));
  return newApp;
};
