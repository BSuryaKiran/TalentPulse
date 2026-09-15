// Mock Profile Data for Job Seeker Frontend (Phase 3)
// Structured for future Profile Service backend microservice integration

export const INITIAL_PROFILE = {
  fullName: 'Alex Morgan',
  email: 'seeker@talentpulse.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  summary:
    'Results-driven Senior Full-Stack Engineer with 4+ years of experience designing and deploying high-performance web applications using React, Spring Boot, and cloud microservices. Passionate about building intuitive UI component architectures and scalable backend APIs.',
  skills: [
    'React',
    'JavaScript',
    'Spring Boot',
    'Java',
    'SQL',
    'Git',
    'CSS3',
    'REST APIs',
    'Node.js',
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      startYear: '2018',
      endYear: '2022',
    },
    {
      id: 'edu-2',
      degree: 'Certified AWS Cloud Associate',
      institution: 'Amazon Web Services Training',
      startYear: '2023',
      endYear: '2023',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Frontend Software Engineer',
      company: 'CloudPulse Technologies',
      startYear: '2022',
      endYear: 'Present',
      description:
        'Engineered responsive web applications in React, optimized bundle performance by 35%, and built reusable component libraries for enterprise analytics portals.',
    },
    {
      id: 'exp-2',
      title: 'Software Engineering Intern',
      company: 'Apex Systems Enterprise',
      startYear: '2021',
      endYear: '2022',
      description:
        'Contributed to Spring Boot backend APIs, designed PostgreSQL database schemas, and implemented automated unit test suites.',
    },
  ],
  resume: {
    fileName: 'Alex_Morgan_Resume_2026.pdf',
    status: 'Verified & Active',
    lastUploaded: '2026-03-01',
    fileSize: '1.2 MB',
  },
};

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
      // ignore
    }
  }

  return {
    email: email || 'seeker@talentpulse.com',
    name: name,
  };
};

const getProfileStorageKey = (email) => `tp_profile_${email}`;

export const getProfile = (userOrEmail) => {
  const { email, name } = resolveUserInfo(userOrEmail);
  const isDemo = email === 'seeker@talentpulse.com' || email.includes('demo');
  const storageKey = getProfileStorageKey(email);

  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }

  if (isDemo) {
    localStorage.setItem(storageKey, JSON.stringify(INITIAL_PROFILE));
    return INITIAL_PROFILE;
  }

  // Newly registered user: clean profile with only signup name & email
  const newProfile = {
    fullName: name || '',
    email: email,
    phone: '',
    location: '',
    summary: '',
    skills: [],
    education: [],
    experience: [],
    resume: null,
  };

  localStorage.setItem(storageKey, JSON.stringify(newProfile));
  return newProfile;
};

export const saveProfile = (updatedProfile, userOrEmail) => {
  const { email } = resolveUserInfo(userOrEmail || updatedProfile);
  const storageKey = getProfileStorageKey(email);
  localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
  return updatedProfile;
};

