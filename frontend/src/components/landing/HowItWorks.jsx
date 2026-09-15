import { useState } from 'react';
import { UserCheck, Building2, UserPlus, Search, Send, BarChart2, FilePlus2, Users, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('job-seeker');

  const seekerSteps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Sign up and build your comprehensive candidate profile with skills, education, experience, and resume details.',
      icon: <UserPlus size={22} />,
    },
    {
      step: '02',
      title: 'Discover Opportunities',
      description: 'Explore live enterprise job openings, filter by location, role type, or required technical skills.',
      icon: <Search size={22} />,
    },
    {
      step: '03',
      title: 'Apply Seamlessly',
      description: 'Submit your job application with one click through our centralized enterprise application system.',
      icon: <Send size={22} />,
    },
    {
      step: '04',
      title: 'Track Application Status',
      description: 'Monitor your application status in real-time from Submitted to Under Review or Interview stages.',
      icon: <BarChart2 size={22} />,
    },
  ];

  const recruiterSteps = [
    {
      step: '01',
      title: 'Create Recruiter Profile',
      description: 'Register as an enterprise recruiter to access talent management and job posting tools.',
      icon: <Building2 size={22} />,
    },
    {
      step: '02',
      title: 'Post a Job Opening',
      description: 'Define job requirements, salary ranges, location, and technical skill prerequisites.',
      icon: <FilePlus2 size={22} />,
    },
    {
      step: '03',
      title: 'Review Candidates',
      description: 'Evaluate candidate applications, view professional profiles, and assess candidate qualifications.',
      icon: <Users size={22} />,
    },
    {
      step: '04',
      title: 'Manage Applications',
      description: 'Update application statuses, advance candidates through hiring pipelines, and complete recruitment.',
      icon: <CheckCircle2 size={22} />,
    },
  ];

  const currentSteps = activeTab === 'job-seeker' ? seekerSteps : recruiterSteps;

  return (
    <section id="how-it-works" className="section-container">
      <div className="section-header text-center">
        <span className="section-subtitle">Streamlined Process</span>
        <h2 className="section-title">How TalentPulse Works</h2>
        <p className="section-description">
          A seamless step-by-step experience for both job seekers and hiring teams.
        </p>

        {/* User Role Switcher Tabs */}
        <div className="how-it-works-tabs">
          <button
            onClick={() => setActiveTab('job-seeker')}
            className={`tab-btn ${activeTab === 'job-seeker' ? 'active' : ''}`}
          >
            <UserCheck size={18} style={{ marginRight: 8 }} />
            <span>For Job Seekers</span>
          </button>
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`tab-btn ${activeTab === 'recruiter' ? 'active' : ''}`}
          >
            <Building2 size={18} style={{ marginRight: 8 }} />
            <span>For Recruiters</span>
          </button>
        </div>
      </div>

      <div className="steps-grid">
        {currentSteps.map((stepItem, idx) => (
          <div key={idx} className="step-card">
            <div className="step-header">
              <span className="step-number">{stepItem.step}</span>
              <div className="step-icon">{stepItem.icon}</div>
            </div>
            <h3 className="step-title">{stepItem.title}</h3>
            <p className="step-description">{stepItem.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
