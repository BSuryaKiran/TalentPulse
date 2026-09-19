// Mock Applicant Data & LocalStorage Handlers for Recruiter Workspace (M2 - Phase 5)
// Structured for future Application Service microservice integration

export const INITIAL_RECRUITER_APPLICANTS = [
  {
    id: 'app-rec-201',
    recruiterEmail: 'recruiter@talentpulse.com',
    recruiterId: 1,
    jobId: 'rec-job-101',
    jobTitle: 'Senior Frontend Engineer (React & TypeScript)',
    company: 'TechPulse Global Solutions',
    appliedDate: '2026-03-02',
    status: 'APPLIED',
    experience: '4 Years',
    resume: {
      fileName: 'Michael_Chen_Resume_2026.pdf',
      fileSize: '1.4 MB',
      lastUploaded: '2026-03-02',
    },
    candidate: {
      id: 'cand-101',
      fullName: 'Michael Chen',
      email: 'mchen.dev@example.com',
      phone: '+1 (555) 382-9102',
      location: 'San Francisco, CA',
      summary:
        'Senior Frontend Engineer with 4+ years of expertise building scalable React web applications, TypeScript component libraries, and optimizing bundle performance.',
      skills: ['React', 'TypeScript', 'JavaScript', 'Vite', 'Redux', 'CSS3', 'REST APIs'],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Science',
          institution: 'Stanford University',
          year: '2018 - 2022',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          title: 'Frontend Software Engineer',
          company: 'Apex Cloud Systems',
          period: '2022 - Present',
          description:
            'Architected modular React design systems, reduced web page load times by 40%, and integrated microfrontend architectures.',
        },
        {
          id: 'exp-2',
          title: 'Web Developer Intern',
          company: 'Silicon Bay Tech',
          period: '2021 - 2022',
          description: 'Built responsive web forms, implemented state management, and optimized cross-browser UI components.',
        },
      ],
    },
  },
  {
    id: 'app-rec-202',
    recruiterEmail: 'recruiter@talentpulse.com',
    recruiterId: 1,
    jobId: 'rec-job-101',
    jobTitle: 'Senior Frontend Engineer (React & TypeScript)',
    company: 'TechPulse Global Solutions',
    appliedDate: '2026-03-03',
    status: 'SHORTLISTED',
    experience: '5 Years',
    resume: {
      fileName: 'Elena_Rostova_Lead_Frontend.pdf',
      fileSize: '1.8 MB',
      lastUploaded: '2026-03-03',
    },
    candidate: {
      id: 'cand-102',
      fullName: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      phone: '+1 (555) 491-2093',
      location: 'San Jose, CA',
      summary:
        'Senior Web Engineer specializing in React, Next.js, and enterprise SaaS frontend architectures with a focus on web accessibility (WCAG 2.1) and unit testing.',
      skills: ['React', 'Next.js', 'TypeScript', 'Jest', 'GraphQL', 'Tailwind CSS'],
      education: [
        {
          id: 'edu-1',
          degree: 'M.S. in Software Engineering',
          institution: 'San Jose State University',
          year: '2019 - 2021',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          title: 'Senior Frontend Engineer',
          company: 'DataFlow Enterprise',
          period: '2021 - Present',
          description:
            'Led a team of 4 frontend engineers, deployed React applications using Docker, and designed GraphQL API client wrappers.',
        },
      ],
    },
  },
  {
    id: 'app-rec-203',
    recruiterEmail: 'recruiter@talentpulse.com',
    recruiterId: 1,
    jobId: 'rec-job-102',
    jobTitle: 'Full-Stack Developer (Java & React)',
    company: 'TechPulse Global Solutions',
    appliedDate: '2026-03-06',
    status: 'UNDER_REVIEW',
    experience: '3 Years',
    resume: {
      fileName: 'David_Kim_FullStack.pdf',
      fileSize: '1.2 MB',
      lastUploaded: '2026-03-06',
    },
    candidate: {
      id: 'cand-103',
      fullName: 'David Kim',
      email: 'dkim.code@example.com',
      phone: '+1 (555) 832-1940',
      location: 'Oakland, CA',
      summary:
        'Full-Stack Software Engineer with hands-on experience developing Spring Boot backend microservices and responsive React applications.',
      skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker', 'Git'],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Software Engineering',
          institution: 'UC Berkeley',
          year: '2019 - 2023',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          title: 'Software Engineer',
          company: 'NexGen Platforms',
          period: '2023 - Present',
          description:
            'Built RESTful microservice APIs in Spring Boot, created PostgreSQL database schemas, and integrated React user dashboards.',
        },
      ],
    },
  },
  {
    id: 'app-rec-204',
    recruiterEmail: 'recruiter@talentpulse.com',
    recruiterId: 1,
    jobId: 'rec-job-103',
    jobTitle: 'Lead DevOps & Cloud Infrastructure Engineer',
    company: 'TechPulse Global Solutions',
    appliedDate: '2026-03-09',
    status: 'SELECTED',
    experience: '6 Years',
    resume: {
      fileName: 'Samantha_Vance_DevOps_AWS.pdf',
      fileSize: '2.1 MB',
      lastUploaded: '2026-03-09',
    },
    candidate: {
      id: 'cand-104',
      fullName: 'Samantha Vance',
      email: 'sam.vance@example.com',
      phone: '+1 (555) 293-8104',
      location: 'Remote (Seattle, WA)',
      summary:
        'Lead Cloud Systems & DevOps Engineer certified in AWS Infrastructure, Kubernetes container orchestration, and automated CI/CD pipelines.',
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux', 'Python'],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Engineering',
          institution: 'University of Washington',
          year: '2016 - 2020',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          title: 'Senior DevOps Lead',
          company: 'CloudMatrix Technologies',
          period: '2020 - Present',
          description:
            'Managed multi-region AWS EKS clusters, implemented zero-downtime CI/CD deployment pipelines, and authored Terraform modules.',
        },
      ],
    },
  },
  {
    id: 'app-rec-205',
    recruiterEmail: 'recruiter@talentpulse.com',
    recruiterId: 1,
    jobId: 'rec-job-101',
    jobTitle: 'Senior Frontend Engineer (React & TypeScript)',
    company: 'TechPulse Global Solutions',
    appliedDate: '2026-03-01',
    status: 'REJECTED',
    experience: '1 Year',
    resume: {
      fileName: 'Carlos_Rodriguez_Resume.pdf',
      fileSize: '950 KB',
      lastUploaded: '2026-03-01',
    },
    candidate: {
      id: 'cand-105',
      fullName: 'Carlos Rodriguez',
      email: 'carlos.rod@example.com',
      phone: '+1 (555) 712-4091',
      location: 'San Francisco, CA',
      summary:
        'Junior Web Developer with 1 year experience building HTML/CSS landing pages and basic React prototypes.',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
      education: [
        {
          id: 'edu-1',
          degree: 'Coding Bootcamp Certificate',
          institution: 'General Assembly',
          year: '2024',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          title: 'Junior Web Developer',
          company: 'Local Agency Studio',
          period: '2024 - 2025',
          description: 'Assisted in building static web client templates.',
        },
      ],
    },
  },
  {
    id: 'app-rec-206',
    recruiterEmail: 'recruiter@talentpulse.com',
    recruiterId: 1,
    jobId: 'rec-job-102',
    jobTitle: 'Full-Stack Developer (Java & React)',
    company: 'TechPulse Global Solutions',
    appliedDate: '2026-03-07',
    status: 'SHORTLISTED',
    experience: '4 Years',
    resume: {
      fileName: 'Amanda_Taylor_Software_Eng.pdf',
      fileSize: '1.5 MB',
      lastUploaded: '2026-03-07',
    },
    candidate: {
      id: 'cand-106',
      fullName: 'Amanda Taylor',
      email: 'amanda.taylor@example.com',
      phone: '+1 (555) 918-2304',
      location: 'San Francisco, CA',
      summary:
        'Software Engineer with 4 years of experience building Spring Boot APIs, PostgreSQL relational schemas, and modern React interfaces.',
      skills: ['Java', 'Spring Boot', 'React', 'SQL', 'Git', 'REST APIs'],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Science',
          institution: 'UC Davis',
          year: '2018 - 2022',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          title: 'Full Stack Engineer',
          company: 'Apex Software Inc.',
          period: '2022 - Present',
          description:
            'Developed REST microservices in Java Spring Boot and built frontend dashboards in React.',
        },
      ],
    },
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

const getApplicantsStorageKey = (email) => `tp_applicants_${email}`;

export const getRecruiterApplicants = (userOrEmail) => {
  const email = resolveRecruiterEmail(userOrEmail);
  const storageKey = getApplicantsStorageKey(email);

  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }

  const isDemo = email === 'recruiter@talentpulse.com' || email.includes('demo');
  const initialData = isDemo ? INITIAL_RECRUITER_APPLICANTS : [];

  localStorage.setItem(storageKey, JSON.stringify(initialData));
  return initialData;
};

export const getApplicantById = (id, userOrEmail) => {
  const applicants = getRecruiterApplicants(userOrEmail);
  return applicants.find((app) => app.id === id) || null;
};

export const updateApplicantStatus = (id, newStatus, userOrEmail) => {
  const email = resolveRecruiterEmail(userOrEmail);
  const applicants = getRecruiterApplicants(email);

  let updatedApplicant = null;
  const updatedList = applicants.map((app) => {
    if (app.id === id) {
      updatedApplicant = { ...app, status: newStatus };
      return updatedApplicant;
    }
    return app;
  });

  const storageKey = getApplicantsStorageKey(email);
  localStorage.setItem(storageKey, JSON.stringify(updatedList));
  return updatedApplicant;
};

export const getApplicantsByJobId = (jobId, userOrEmail) => {
  const applicants = getRecruiterApplicants(userOrEmail);
  if (!jobId || jobId === 'ALL') return applicants;
  return applicants.filter((app) => app.jobId === jobId);
};
