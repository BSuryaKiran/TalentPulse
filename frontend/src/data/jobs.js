// Mock Jobs Data for Job Seeker Frontend (Phase 2)
// Structured for future microservices integration (Job Service)

export const INITIAL_JOBS = [
  {
    id: 'job-101',
    title: 'Senior React Developer',
    company: 'CloudPulse Technologies',
    location: 'San Francisco, CA',
    isRemote: true,
    employmentType: 'Full Time',
    experienceLevel: '2–5 Years',
    salaryRange: '$110,000 - $140,000',
    department: 'Frontend Engineering',
    postedDate: '2026-03-01',
    deadline: '2026-04-15',
    skills: ['React', 'JavaScript', 'Redux', 'TypeScript', 'Tailwind CSS', 'Vite'],
    description:
      'CloudPulse Technologies is looking for a passionate Senior React Developer to join our Cloud Applications team. You will build highly interactive, accessible, and performant user interfaces for enterprise analytics workflows.',
    responsibilities: [
      'Architect and build modern, responsive web interfaces using React and JavaScript.',
      'Collaborate with backend engineers to define API endpoints and data models.',
      'Optimize web application performance, accessibility, and cross-browser compatibility.',
      'Participate in code reviews and mentor junior frontend developers.',
    ],
    qualifications: [
      '3+ years of professional web application development experience with React.',
      'Strong proficiency in JavaScript (ES6+), HTML5, CSS3, and DOM manipulation.',
      'Experience with REST APIs, state management libraries, and Vite/Webpack.',
      'Bachelor’s degree in Computer Science or equivalent practical experience.',
    ],
  },
  {
    id: 'job-102',
    title: 'Java Backend Developer',
    company: 'Apex Systems Enterprise',
    location: 'New York, NY',
    isRemote: false,
    employmentType: 'Full Time',
    experienceLevel: '2–5 Years',
    salaryRange: '$120,000 - $150,000',
    department: 'Backend Engineering',
    postedDate: '2026-03-03',
    deadline: '2026-04-20',
    skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker', 'REST API'],
    description:
      'Apex Systems is seeking a Java Backend Developer to build scalable microservices power our core workforce management portal. You will design, implement, and maintain high-throughput backend APIs.',
    responsibilities: [
      'Develop robust Spring Boot microservices and RESTful API endpoints.',
      'Design clean database schemas and write efficient SQL queries in PostgreSQL.',
      'Implement authentication, authorization, and secure microservice communications.',
      'Monitor and tune application performance under high user loads.',
    ],
    qualifications: [
      '3+ years of experience developing backend applications in Java and Spring Boot.',
      'Solid knowledge of microservice architecture, JPA/Hibernate, and relational databases.',
      'Familiarity with CI/CD pipelines, Docker containerization, and unit testing frameworks.',
      'Strong problem-solving skills and understanding of object-oriented design patterns.',
    ],
  },
  {
    id: 'job-103',
    title: 'Software Engineer - Full Stack',
    company: 'NexGen Software Solutions',
    location: 'Austin, TX',
    isRemote: true,
    employmentType: 'Full Time',
    experienceLevel: '0–2 Years',
    salaryRange: '$85,000 - $105,000',
    department: 'Product Engineering',
    postedDate: '2026-03-05',
    deadline: '2026-04-10',
    skills: ['React', 'Node.js', 'Java', 'JavaScript', 'MySQL', 'Git'],
    description:
      'NexGen Software is hiring an enthusiastic Full Stack Software Engineer to build features across our web portal and cloud backend. Great opportunity for early-career developers to make an impact.',
    responsibilities: [
      'Develop end-to-end features from front-end React components to backend APIs.',
      'Write clean, modular code with comprehensive unit and integration tests.',
      'Troubleshoot and fix production defects across web applications.',
      'Work closely with Product Managers and UI/UX designers.',
    ],
    qualifications: [
      '1+ year of experience or strong academic projects with React and Java/Node.js.',
      'Good understanding of web fundamentals, HTTP protocols, and RESTful architectures.',
      'Degree in Computer Science, Software Engineering, or related technical discipline.',
    ],
  },
  {
    id: 'job-104',
    title: 'Data Analyst & Insights Specialist',
    company: 'DataFlex Analytics',
    location: 'Chicago, IL',
    isRemote: true,
    employmentType: 'Full Time',
    experienceLevel: '0–2 Years',
    salaryRange: '$75,000 - $95,000',
    department: 'Data & Analytics',
    postedDate: '2026-03-06',
    deadline: '2026-04-25',
    skills: ['SQL', 'Python', 'PowerBI', 'Tableau', 'Data Modeling', 'Excel'],
    description:
      'DataFlex Analytics helps enterprises translate complex talent datasets into actionable intelligence. We are hiring a Data Analyst to create interactive dashboards and pipeline reports.',
    responsibilities: [
      'Extract, transform, and load data from multiple enterprise databases using SQL.',
      'Build interactive dashboards and visualizations in PowerBI / Tableau.',
      'Analyze talent acquisition metrics and present findings to key stakeholders.',
      'Collaborate with data engineers to automate recurring report pipelines.',
    ],
    qualifications: [
      'Proficiency in SQL querying, data cleaning, and reporting techniques.',
      'Hands-on experience with Python data analysis packages (Pandas, NumPy).',
      'Strong analytical mindset and ability to communicate technical insights clearly.',
    ],
  },
  {
    id: 'job-105',
    title: 'Cloud Infrastructure Associate',
    company: 'FinTech Horizons',
    location: 'Seattle, WA',
    isRemote: false,
    employmentType: 'Internship',
    experienceLevel: 'Fresher',
    salaryRange: '$35 - $45 / hour',
    department: 'DevOps & Infrastructure',
    postedDate: '2026-03-08',
    deadline: '2026-04-30',
    skills: ['AWS', 'Linux', 'Docker', 'Python', 'Shell Scripting', 'Git'],
    description:
      'FinTech Horizons offers an exciting summer internship program for aspiring cloud and infrastructure engineers. Work alongside senior cloud architects building AWS infrastructure.',
    responsibilities: [
      'Assist in provisioning and managing AWS cloud infrastructure.',
      'Automate deployment scripts using Shell scripting and Python.',
      'Participate in setup of CI/CD build pipelines for microservices.',
    ],
    qualifications: [
      'Currently pursuing or recent graduate in Computer Science or IT.',
      'Basic knowledge of Linux administration, networking fundamentals, and Git.',
      'Eagerness to learn AWS services, Docker, and infrastructure automation.',
    ],
  },
  {
    id: 'job-106',
    title: 'Cybersecurity Analyst',
    company: 'CyberShield Security',
    location: 'Washington, DC',
    isRemote: false,
    employmentType: 'Full Time',
    experienceLevel: '5+ Years',
    salaryRange: '$135,000 - $165,000',
    department: 'Security Operations',
    postedDate: '2026-03-02',
    deadline: '2026-04-18',
    skills: ['Cybersecurity', 'SIEM', 'Network Security', 'Python', 'Threat Analysis'],
    description:
      'CyberShield Security is seeking a Senior Cybersecurity Analyst to safeguard enterprise recruitment applications and candidate identity data against evolving security threats.',
    responsibilities: [
      'Monitor security incidents, analyze SIEM logs, and respond to security threats.',
      'Perform vulnerability assessments and penetration testing on microservices.',
      'Enforce security compliance standards across identity management services.',
    ],
    qualifications: [
      '5+ years of experience in Information Security or SOC environments.',
      'Relevant security certifications (CISSP, CEH, or Security+) preferred.',
      'Deep understanding of web application vulnerabilities (OWASP Top 10) and cryptography.',
    ],
  },
  {
    id: 'job-107',
    title: 'UI/UX Frontend Developer',
    company: 'Aura AI Labs',
    location: 'Boston, MA',
    isRemote: true,
    employmentType: 'Contract',
    experienceLevel: '2–5 Years',
    salaryRange: '$60 - $80 / hour',
    department: 'Design & Frontend',
    postedDate: '2026-03-09',
    deadline: '2026-04-12',
    skills: ['React', 'Figma', 'CSS3', 'Accessibility', 'JavaScript', 'HTML5'],
    description:
      'Aura AI Labs is contracting an expert UI/UX Frontend Developer to refine component design systems, micro-interactions, and accessibility standards for our recruitment portal.',
    responsibilities: [
      'Convert Figma prototypes into high-fidelity, accessible React UI components.',
      'Build responsive layouts with micro-animations and intuitive navigation.',
      'Ensure WCAG 2.1 AA accessibility compliance across all user interfaces.',
    ],
    qualifications: [
      '3+ years of experience in front-end development with a strong eye for UI/UX design.',
      'Expertise in CSS, Flexbox, Grid, CSS custom variables, and responsive design.',
      'Strong portfolio demonstrating sleek web application designs.',
    ],
  },
  {
    id: 'job-108',
    title: 'DevOps & Microservice Specialist',
    company: 'Quantum Networks',
    location: 'Denver, CO',
    isRemote: true,
    employmentType: 'Full Time',
    experienceLevel: '5+ Years',
    salaryRange: '$140,000 - $175,000',
    department: 'Cloud Operations',
    postedDate: '2026-03-04',
    deadline: '2026-04-22',
    skills: ['Kubernetes', 'Docker', 'Spring Cloud', 'Jenkins', 'Terraform', 'AWS'],
    description:
      'Quantum Networks is hiring a DevOps Specialist to maintain container orchestration, API gateways, service discovery, and zero-downtime deployments for distributed applications.',
    responsibilities: [
      'Manage Kubernetes clusters and service mesh topologies.',
      'Build automated CI/CD pipelines using Jenkins, GitHub Actions, and Docker.',
      'Configure Spring Cloud API Gateway, Eureka discovery server, and config servers.',
    ],
    qualifications: [
      '5+ years of hands-on experience in DevOps, Cloud Engineering, or Systems Architecture.',
      'Strong experience with AWS, Kubernetes, Terraform, and Docker container orchestration.',
    ],
  },
];

export const getJobs = () => {
  const stored = localStorage.getItem('tp_mock_jobs');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_JOBS;
    }
  }
  localStorage.setItem('tp_mock_jobs', JSON.stringify(INITIAL_JOBS));
  return INITIAL_JOBS;
};

export const getJobById = (id) => {
  const jobs = getJobs();
  return jobs.find((j) => j.id === id) || null;
};
