// Mock Users Data for Admin Workspace (M3 Phase 2)
// Structured for future User Management Service / API Gateway integration

export const INITIAL_ADMIN_USERS = [
  {
    id: 'usr-1001',
    name: 'Sarah Connor',
    email: 'admin@talentpulse.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    registeredDate: '2026-01-10',
    lastActive: '2026-03-18 09:45 AM',
    title: 'Platform System Administrator',
    department: 'DevOps & IT Security',
    phone: '+1 (555) 100-2001',
    location: 'San Francisco, CA',
    bio: 'Lead system administrator responsible for access control, platform security, and microservice gateway policies.',
    activityCount: 142,
  },
  {
    id: 'usr-1002',
    name: 'Marcus Vance',
    email: 'recruiter@talentpulse.com',
    role: 'RECRUITER',
    status: 'ACTIVE',
    registeredDate: '2026-01-15',
    lastActive: '2026-03-18 11:20 AM',
    title: 'Senior Technical Talent Partner',
    department: 'Talent Acquisition',
    phone: '+1 (555) 200-3002',
    location: 'Austin, TX',
    bio: 'Oversees software engineering hiring requisitions for cloud, full-stack, and infrastructure teams.',
    company: 'TechPulse Global Solutions',
    activityCount: 89,
  },
  {
    id: 'usr-1003',
    name: 'Alex Morgan',
    email: 'seeker@talentpulse.com',
    role: 'JOB_SEEKER',
    status: 'ACTIVE',
    registeredDate: '2026-02-01',
    lastActive: '2026-03-17 04:15 PM',
    title: 'Senior Full-Stack Developer',
    department: 'Software Engineering',
    phone: '+1 (555) 300-4003',
    location: 'San Francisco, CA',
    bio: 'Results-driven software engineer with 4+ years building high-throughput React and Spring Boot web portals.',
    activityCount: 24,
  },
  {
    id: 'usr-1004',
    name: 'David Chen',
    email: 'd.chen@apexcloud.io',
    role: 'RECRUITER',
    status: 'ACTIVE',
    registeredDate: '2026-02-12',
    lastActive: '2026-03-16 02:30 PM',
    title: 'Lead Technical Recruiter',
    department: 'Human Resources',
    phone: '+1 (555) 400-5004',
    location: 'Seattle, WA',
    bio: 'Managing enterprise tech requisitions and candidate interview pipelines across North America.',
    company: 'CloudPulse Technologies',
    activityCount: 63,
  },
  {
    id: 'usr-1005',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    role: 'JOB_SEEKER',
    status: 'ACTIVE',
    registeredDate: '2026-02-18',
    lastActive: '2026-03-15 01:10 PM',
    title: 'Senior Frontend Engineer',
    department: 'UI/UX Engineering',
    phone: '+1 (555) 500-6005',
    location: 'San Jose, CA',
    bio: 'Specializing in React, Next.js, and enterprise SaaS UI architectures with WCAG accessibility focus.',
    activityCount: 18,
  },
  {
    id: 'usr-1006',
    name: 'Rachel Zane',
    email: 'rachel.z@dataflex.com',
    role: 'RECRUITER',
    status: 'INACTIVE',
    registeredDate: '2026-01-28',
    lastActive: '2026-02-25 10:00 AM',
    title: 'Recruiting Specialist',
    department: 'Analytics & Insights Hiring',
    phone: '+1 (555) 600-7006',
    location: 'Chicago, IL',
    bio: 'Data and AI team talent acquisition specialist. Account temporarily suspended during team reorganization.',
    company: 'DataFlex Analytics',
    activityCount: 31,
  },
  {
    id: 'usr-1007',
    name: 'Michael Scott',
    email: 'mscott.admin@talentpulse.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    registeredDate: '2026-01-05',
    lastActive: '2026-03-18 08:00 AM',
    title: 'Security Compliance Officer',
    department: 'Information Security',
    phone: '+1 (555) 700-8007',
    location: 'New York, NY',
    bio: 'Audits user permissions, RBAC policies, and ensures SOC-2 compliance across platform services.',
    activityCount: 110,
  },
  {
    id: 'usr-1008',
    name: 'Amanda Taylor',
    email: 'amanda.taylor@example.com',
    role: 'JOB_SEEKER',
    status: 'ACTIVE',
    registeredDate: '2026-03-01',
    lastActive: '2026-03-16 06:40 PM',
    title: 'Full-Stack Software Engineer',
    department: 'Engineering',
    phone: '+1 (555) 800-9008',
    location: 'Boston, MA',
    bio: 'Hands-on experience in Java Spring Boot REST microservices and responsive React interfaces.',
    activityCount: 12,
  },
  {
    id: 'usr-1009',
    name: 'James Sterling',
    email: 'jsterling@auratech.ai',
    role: 'RECRUITER',
    status: 'ACTIVE',
    registeredDate: '2026-02-20',
    lastActive: '2026-03-18 10:15 AM',
    title: 'Staffing Lead - AI & Robotics',
    department: 'Talent Acquisition',
    phone: '+1 (555) 900-1009',
    location: 'Boston, MA',
    bio: 'Recruiting leading AI researchers, ML engineers, and robotics software specialists.',
    company: 'Aura AI Labs',
    activityCount: 47,
  },
  {
    id: 'usr-1010',
    name: 'Carlos Rodriguez',
    email: 'carlos.rod@example.com',
    role: 'JOB_SEEKER',
    status: 'INACTIVE',
    registeredDate: '2026-02-14',
    lastActive: '2026-03-01 03:00 PM',
    title: 'Junior Web Developer',
    department: 'Frontend Development',
    phone: '+1 (555) 111-2222',
    location: 'San Francisco, CA',
    bio: 'Junior developer building HTML/CSS components and basic React prototypes. Account deactivated by user request.',
    activityCount: 6,
  },
];

const STORAGE_KEY = 'tp_admin_users';
let memoryUsers = null;

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

/**
 * Get all users from mock storage
 */
export const getAdminUsers = () => {
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
    storage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_USERS));
    return INITIAL_ADMIN_USERS;
  }
  if (!memoryUsers) {
    memoryUsers = [...INITIAL_ADMIN_USERS];
  }
  return memoryUsers;
};

/**
 * Get user by ID
 */
export const getAdminUserById = (id) => {
  const users = getAdminUsers();
  return users.find((u) => String(u.id) === String(id)) || null;
};

/**
 * Update user status (ACTIVE / INACTIVE) in mock storage
 */
export const updateAdminUserStatus = (id, newStatus) => {
  const users = getAdminUsers();
  let updatedUser = null;

  const updatedUsers = users.map((u) => {
    if (String(u.id) === String(id)) {
      updatedUser = {
        ...u,
        status: newStatus,
        lastActive: `Updated ${new Date().toISOString().split('T')[0]}`,
      };
      return updatedUser;
    }
    return u;
  });

  if (!updatedUser) {
    throw new Error(`User with ID ${id} not found.`);
  }

  const storage = getStorage();
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  } else {
    memoryUsers = updatedUsers;
  }
  return updatedUser;
};
