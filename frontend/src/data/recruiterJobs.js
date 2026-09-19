// Scoped Mock Data & LocalStorage Handlers for Recruiter Job Management (M2 - Phase 2)
// Designed for seamless transition to Job Service REST API (GET/POST/PUT/DELETE /jobs)

export const INITIAL_RECRUITER_JOBS = [
  {
    id: 'rec-job-101',
    title: 'Senior Frontend Engineer (React & TypeScript)',
    company: 'TechPulse Global Solutions',
    location: 'San Francisco, CA',
    employmentType: 'Full Time',
    workMode: 'Hybrid',
    experience: '3–5 Years',
    salary: '$125,000 - $155,000 / year',
    description:
      'TechPulse Global is seeking a Senior Frontend Engineer to lead component architecture and design high-performance web applications using React, Vite, and modern CSS.',
    responsibilities: [
      'Architect modular, accessible UI components in React.',
      'Collaborate with product designers and backend microservice engineers.',
      'Improve application bundle size, state management, and web performance metrics.',
      'Participate in code reviews and champion frontend best practices.',
    ],
    skills: ['React', 'JavaScript', 'TypeScript', 'Vite', 'CSS3', 'REST APIs'],
    qualifications: [
      '3+ years of professional React application development experience.',
      'Strong proficiency in ES6+, DOM manipulation, and responsive web design.',
      'Experience with REST APIs and state management patterns.',
      'Bachelor’s degree in Computer Science or equivalent practical experience.',
    ],
    benefits: ['Comprehensive Health & Dental Insurance', '401(k) Matching (5%)', 'Flexible Work Schedule', '$1,500 Annual Learning Budget'],
    postedDate: '2026-03-01',
    deadline: '2026-04-15',
    applicants: 24,
    status: 'ACTIVE',
    recruiterEmail: 'recruiter@talentpulse.com',
  },
  {
    id: 'rec-job-102',
    title: 'Full-Stack Developer (Java & React)',
    company: 'TechPulse Global Solutions',
    location: 'San Francisco, CA',
    employmentType: 'Full Time',
    workMode: 'On-Site',
    experience: '2–4 Years',
    salary: '$115,000 - $140,000 / year',
    description:
      'Looking for a Full-Stack Engineer skilled in Spring Boot backend APIs and React single-page applications for enterprise SaaS modules.',
    responsibilities: [
      'Design, develop, and maintain Spring Boot REST microservices.',
      'Implement responsive React user interfaces integrated with backend APIs.',
      'Design PostgreSQL database schemas and write optimized SQL queries.',
    ],
    skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker', 'Git'],
    qualifications: [
      '2+ years of experience in Java backend development and React frontend.',
      'Knowledge of relational databases, JPA/Hibernate, and microservices.',
      'Solid analytical and problem-solving skills.',
    ],
    benefits: ['Full Medical & Vision', 'Equity Options', 'Subsidized Transit Pass', 'Gym Membership'],
    postedDate: '2026-03-05',
    deadline: '2026-04-30',
    applicants: 18,
    status: 'ACTIVE',
    recruiterEmail: 'recruiter@talentpulse.com',
  },
  {
    id: 'rec-job-103',
    title: 'Lead DevOps & Cloud Infrastructure Engineer',
    company: 'TechPulse Global Solutions',
    location: 'Remote',
    employmentType: 'Full Time',
    workMode: 'Remote',
    experience: '5+ Years',
    salary: '$145,000 - $175,000 / year',
    description:
      'Lead our cloud infrastructure automation, Kubernetes orchestration pipelines, and CI/CD deployment strategies on AWS & Docker.',
    responsibilities: [
      'Manage AWS cloud infrastructure using Terraform infrastructure-as-code.',
      'Maintain Kubernetes clusters, Docker registries, and CI/CD automation.',
      'Ensure zero-downtime microservices deployments and system observability.',
    ],
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux'],
    qualifications: [
      '5+ years in DevOps, SRE, or Cloud Infrastructure engineering.',
      'Deep experience with AWS services (EKS, EC2, RDS, IAM, CloudWatch).',
      'Strong Linux administration and shell scripting skills.',
    ],
    benefits: ['100% Remote Work', 'Unlimited PTO', 'Home Office Stipend', 'Health Benefits'],
    postedDate: '2026-03-08',
    deadline: '2026-05-01',
    applicants: 12,
    status: 'ACTIVE',
    recruiterEmail: 'recruiter@talentpulse.com',
  },
  {
    id: 'rec-job-104',
    title: 'UI/UX Design Systems Lead',
    company: 'TechPulse Global Solutions',
    location: 'San Francisco, CA',
    employmentType: 'Full Time',
    workMode: 'Hybrid',
    experience: '3+ Years',
    salary: '$110,000 - $135,000 / year',
    description:
      'Draft requisition for UI/UX Designer to build scalable enterprise design system components, wireframes, and design guidelines.',
    responsibilities: [
      'Create high-fidelity wireframes, interactive prototypes, and design specs.',
      'Maintain enterprise Figma UI kit and design token system.',
    ],
    skills: ['Figma', 'UI/UX', 'Design Systems', 'User Research', 'Prototyping'],
    qualifications: ['3+ years in product design and design system management.'],
    benefits: ['Health & Dental', 'Flexible Hours'],
    postedDate: '2026-03-10',
    deadline: '2026-04-25',
    applicants: 0,
    status: 'DRAFT',
    recruiterEmail: 'recruiter@talentpulse.com',
  },
  {
    id: 'rec-job-105',
    title: 'Junior QA Automation Engineer',
    company: 'TechPulse Global Solutions',
    location: 'San Francisco, CA',
    employmentType: 'Contract',
    workMode: 'On-Site',
    experience: '1–2 Years',
    salary: '$70,000 - $85,000 / year',
    description:
      'Closed job posting for QA Automation Engineer who completed testing scripts for frontend and API endpoints.',
    responsibilities: ['Write Playwright and Jest automated test suites.'],
    skills: ['JavaScript', 'Jest', 'Playwright', 'Selenium', 'QA Automation'],
    qualifications: ['1+ year in software testing and test script writing.'],
    benefits: ['Health Coverage'],
    postedDate: '2026-02-01',
    deadline: '2026-03-01',
    applicants: 35,
    status: 'CLOSED',
    recruiterEmail: 'recruiter@talentpulse.com',
  },
];

const resolveRecruiterEmail = (userOrEmail) => {
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
      // fallback
    }
  }

  return email || 'recruiter@talentpulse.com';
};

const getRecruiterJobsStorageKey = (email) => `tp_recruiter_jobs_${email}`;

export const getRecruiterJobs = (userOrEmail) => {
  const email = resolveRecruiterEmail(userOrEmail);
  const storageKey = getRecruiterJobsStorageKey(email);

  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  // Initialize scoped jobs for demo recruiter
  const isDemoRecruiter = email === 'recruiter@talentpulse.com' || email.includes('demo');
  const initialJobs = isDemoRecruiter ? INITIAL_RECRUITER_JOBS : [];

  localStorage.setItem(storageKey, JSON.stringify(initialJobs));
  return initialJobs;
};

export const getRecruiterJobById = (id, userOrEmail) => {
  const jobs = getRecruiterJobs(userOrEmail);
  return jobs.find((j) => j.id === id) || null;
};

export const saveRecruiterJob = (jobData, userOrEmail) => {
  const email = resolveRecruiterEmail(userOrEmail);
  const jobs = getRecruiterJobs(email);

  let updatedJobs;
  let savedJob = null;

  if (jobData.id) {
    // Existing job update
    updatedJobs = jobs.map((job) => {
      if (job.id === jobData.id) {
        savedJob = { ...job, ...jobData };
        return savedJob;
      }
      return job;
    });
  } else {
    // New job creation
    savedJob = {
      ...jobData,
      id: `rec-job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicants: jobData.applicants || 0,
      status: jobData.status || 'ACTIVE',
      recruiterEmail: email,
    };
    updatedJobs = [savedJob, ...jobs];
  }

  const storageKey = getRecruiterJobsStorageKey(email);
  localStorage.setItem(storageKey, JSON.stringify(updatedJobs));
  return savedJob;
};

export const updateJobStatus = (id, newStatus, userOrEmail) => {
  const email = resolveRecruiterEmail(userOrEmail);
  const jobs = getRecruiterJobs(email);

  const updatedJobs = jobs.map((job) => {
    if (job.id === id) {
      return { ...job, status: newStatus };
    }
    return job;
  });

  const storageKey = getRecruiterJobsStorageKey(email);
  localStorage.setItem(storageKey, JSON.stringify(updatedJobs));
  return updatedJobs.find((j) => j.id === id) || null;
};

export const deleteRecruiterJob = (id, userOrEmail) => {
  const email = resolveRecruiterEmail(userOrEmail);
  const jobs = getRecruiterJobs(email);

  const updatedJobs = jobs.filter((job) => job.id !== id);

  const storageKey = getRecruiterJobsStorageKey(email);
  localStorage.setItem(storageKey, JSON.stringify(updatedJobs));
  return true;
};
