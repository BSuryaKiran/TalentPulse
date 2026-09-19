// Mock Data and Storage Handlers for Recruiter Workspace (M2 - Phase 1)
// Designed for seamless backend API integration in later phases

export const INITIAL_RECRUITER_PROFILE = {
  fullName: 'Sarah Jenkins',
  email: 'recruiter@talentpulse.com',
  companyName: 'TechPulse Global Solutions',
  designation: 'Senior Talent Acquisition Lead',
  phone: '+1 (555) 492-8102',
  companyWebsite: 'https://techpulse.example.com',
  companyDescription:
    'TechPulse Global Solutions is a leading enterprise software provider innovating cloud microservices, AI-driven workflow engines, and modern developer tooling across global teams.',
  location: 'San Francisco, CA',
  department: 'Human Resources & Talent Acquisition',
};

export const RECRUITER_STATS = [
  {
    id: 'stat-active-jobs',
    title: 'Active Jobs',
    value: '12',
    change: '+2 this week',
    isPositive: true,
    icon: 'Briefcase',
    color: 'blue',
    description: 'Open requisitions currently receiving applications',
  },
  {
    id: 'stat-applications',
    title: 'Total Applications',
    value: '148',
    change: '+24 new today',
    isPositive: true,
    icon: 'Users',
    color: 'indigo',
    description: 'Candidates across all active job postings',
  },
  {
    id: 'stat-shortlisted',
    title: 'Shortlisted',
    value: '34',
    change: '12 pending review',
    isPositive: true,
    icon: 'UserCheck',
    color: 'violet',
    description: 'Candidates selected for initial evaluation',
  },
  {
    id: 'stat-interviews',
    title: 'Interviews Scheduled',
    value: '8',
    change: '3 scheduled today',
    isPositive: true,
    icon: 'Calendar',
    color: 'emerald',
    description: 'Active interview sessions planned for this week',
  },
];

export const RECRUITER_QUICK_ACTIONS = [
  {
    id: 'action-post-job',
    title: 'Post a New Job',
    description: 'Publish a new job requisition and start receiving qualified applicants.',
    icon: 'PlusCircle',
    path: '/recruiter/jobs',
    badgeText: 'New',
    buttonText: 'Create Requisition',
    variant: 'primary',
  },
  {
    id: 'action-manage-jobs',
    title: 'Manage Open Jobs',
    description: 'Edit active listings, track candidate flow, or update requisition status.',
    icon: 'Briefcase',
    path: '/recruiter/jobs',
    buttonText: 'View All Jobs',
    variant: 'secondary',
  },
  {
    id: 'action-view-applicants',
    title: 'Review Applicants',
    description: 'Screen recent resume submissions, update applicant status, or send notes.',
    icon: 'FileSpreadsheet',
    path: '/recruiter/applicants',
    buttonText: 'Browse Applicants',
    variant: 'secondary',
  },
  {
    id: 'action-recruiter-profile',
    title: 'Company & Profile',
    description: 'Manage recruiter bio, designation, and public employer information.',
    icon: 'Building2',
    path: '/recruiter/profile',
    buttonText: 'Edit Profile',
    variant: 'outline',
  },
];

export const RECRUITER_ACTIVITIES = [
  {
    id: 'act-1',
    candidateName: 'Michael Chen',
    jobTitle: 'Senior Frontend Engineer',
    type: 'APPLICATION',
    actionText: 'submitted a new application for',
    time: '15 mins ago',
    status: 'New',
    statusVariant: 'info',
  },
  {
    id: 'act-2',
    candidateName: 'Elena Rostova',
    jobTitle: 'Full-Stack Developer (React & Node)',
    type: 'SHORTLISTED',
    actionText: 'was shortlisted by Hiring Team for',
    time: '1 hour ago',
    status: 'Shortlisted',
    statusVariant: 'purple',
  },
  {
    id: 'act-3',
    candidateName: 'David Kim',
    jobTitle: 'Lead DevOps & Cloud Infrastructure',
    type: 'INTERVIEW',
    actionText: 'interview confirmed for tomorrow at 2:00 PM -',
    time: '3 hours ago',
    status: 'Scheduled',
    statusVariant: 'success',
  },
  {
    id: 'act-4',
    candidateName: 'Samantha Vance',
    jobTitle: 'Senior Frontend Engineer',
    type: 'REVIEW',
    actionText: 'resume review completed for',
    time: '5 hours ago',
    status: 'Under Review',
    statusVariant: 'warning',
  },
  {
    id: 'act-5',
    candidateName: 'Carlos Rodriguez',
    jobTitle: 'Backend Microservices Engineer',
    type: 'APPLICATION',
    actionText: 'applied with resume matching 94% skills for',
    time: 'Yesterday',
    status: 'New',
    statusVariant: 'info',
  },
];

const resolveUserInfo = (userOrEmail) => {
  let email = '';
  let name = '';

  if (typeof userOrEmail === 'string') {
    email = userOrEmail.toLowerCase().trim();
  } else if (userOrEmail && typeof userOrEmail === 'object') {
    email = (userOrEmail.email || '').toLowerCase().trim();
    name = userOrEmail.name || userOrEmail.fullName || '';
  }

  if (!email) {
    try {
      const storedUser = localStorage.getItem('tp_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        email = (parsed?.email || '').toLowerCase().trim();
        name = parsed?.name || parsed?.fullName || '';
      }
    } catch {
      // fallback ignore
    }
  }

  return {
    email: email || 'recruiter@talentpulse.com',
    name: name,
  };
};

const getRecruiterProfileStorageKey = (email) => `tp_recruiter_profile_${email}`;

export const getRecruiterProfile = (userOrEmail) => {
  const { email, name } = resolveUserInfo(userOrEmail);
  const storageKey = getRecruiterProfileStorageKey(email);

  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  // Default recruiter profile
  const defaultProfile = {
    ...INITIAL_RECRUITER_PROFILE,
    email: email,
    fullName: name || INITIAL_RECRUITER_PROFILE.fullName,
  };

  localStorage.setItem(storageKey, JSON.stringify(defaultProfile));
  return defaultProfile;
};

export const saveRecruiterProfile = (updatedProfile, userOrEmail) => {
  const { email } = resolveUserInfo(userOrEmail || updatedProfile);
  const storageKey = getRecruiterProfileStorageKey(email);
  localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
  return updatedProfile;
};
