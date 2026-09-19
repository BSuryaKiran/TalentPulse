// Mock Platform Activity Stream for Admin Workspace (M3 Phase 2)

export const INITIAL_ADMIN_ACTIVITIES = [
  {
    id: 'act-301',
    type: 'APPLICATION_SUBMITTED',
    title: 'Candidate Application Submitted',
    description: 'Alex Morgan submitted an application for Senior React Developer.',
    entityName: 'CloudPulse Technologies',
    entityType: 'Job Requisition',
    user: 'Alex Morgan (Job Seeker)',
    timestamp: '10 minutes ago',
    date: '2026-03-18 10:45 AM',
    badgeClass: 'badge-info',
  },
  {
    id: 'act-302',
    type: 'JOB_POSTED',
    title: 'New Requisition Published',
    description: 'Marcus Vance published requisition: Lead DevOps & Cloud Infrastructure Engineer.',
    entityName: 'TechPulse Global Solutions',
    entityType: 'Job Requisition',
    user: 'Marcus Vance (Recruiter)',
    timestamp: '45 minutes ago',
    date: '2026-03-18 10:10 AM',
    badgeClass: 'badge-success',
  },
  {
    id: 'act-303',
    type: 'STATUS_CHANGED',
    title: 'Candidate Shortlisted',
    description: 'Elena Rostova was moved to SHORTLISTED for UI/UX Frontend Developer.',
    entityName: 'Aura AI Labs',
    entityType: 'Application',
    user: 'James Sterling (Recruiter)',
    timestamp: '2 hours ago',
    date: '2026-03-18 08:50 AM',
    badgeClass: 'badge-purple',
  },
  {
    id: 'act-304',
    type: 'USER_REGISTRATION',
    title: 'New Recruiter Account Created',
    description: 'David Chen registered as a verified Employer Talent Partner.',
    entityName: 'CloudPulse Technologies',
    entityType: 'User Account',
    user: 'David Chen',
    timestamp: '4 hours ago',
    date: '2026-03-18 06:30 AM',
    badgeClass: 'badge-amber',
  },
  {
    id: 'act-305',
    type: 'JOB_CLOSED',
    title: 'Job Requisition Closed',
    description: 'Position Senior Cybersecurity Analyst was filled and closed.',
    entityName: 'CyberShield Security',
    entityType: 'Job Requisition',
    user: 'Rachel Zane (Recruiter)',
    timestamp: '1 day ago',
    date: '2026-03-17 03:20 PM',
    badgeClass: 'badge-secondary',
  },
  {
    id: 'act-306',
    type: 'SYSTEM_AUDIT',
    title: 'Role Permission Verification',
    description: 'Sarah Connor ran quarterly RBAC audit and permission verification for 10 users.',
    entityName: 'Security Audit',
    entityType: 'System',
    user: 'Sarah Connor (Admin)',
    timestamp: '1 day ago',
    date: '2026-03-17 11:15 AM',
    badgeClass: 'badge-primary',
  },
  {
    id: 'act-307',
    type: 'APPLICATION_SUBMITTED',
    title: 'Candidate Application Submitted',
    description: 'Amanda Taylor submitted an application for Full-Stack Developer (Java & React).',
    entityName: 'TechPulse Global Solutions',
    entityType: 'Job Requisition',
    user: 'Amanda Taylor (Job Seeker)',
    timestamp: '2 days ago',
    date: '2026-03-16 02:10 PM',
    badgeClass: 'badge-info',
  },
];

const STORAGE_KEY = 'tp_admin_activity';
let memoryActivities = null;

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

export const getAdminActivities = () => {
  const storage = getStorage();
  if (storage) {
    const stored = storage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_ACTIVITIES));
    return INITIAL_ADMIN_ACTIVITIES;
  }
  if (!memoryActivities) {
    memoryActivities = [...INITIAL_ADMIN_ACTIVITIES];
  }
  return memoryActivities;
};

export const logAdminActivity = (activity) => {
  const current = getAdminActivities();
  const newActivity = {
    id: 'act-' + Date.now(),
    timestamp: 'Just now',
    date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    ...activity,
  };
  const updated = [newActivity, ...current];
  const storage = getStorage();
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } else {
    memoryActivities = updated;
  }
  return newActivity;
};
