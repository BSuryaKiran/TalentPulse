import { Search, UserCheck, Send, BarChart3, Briefcase, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Search size={24} />,
      title: 'Smart Job Discovery',
      description: 'Search and discover relevant opportunities tailored to your technical skills, experience level, and career aspirations.',
    },
    {
      icon: <UserCheck size={24} />,
      title: 'Professional Profiles',
      description: 'Maintain detailed candidate profiles highlighting verified technical skills, education background, work experience, and resume.',
    },
    {
      icon: <Send size={24} />,
      title: 'Easy Applications',
      description: 'Submit job applications effortlessly through a streamlined, centralized interface with instant confirmation.',
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Application Tracking',
      description: 'Monitor real-time application progress and review status updates directly from your candidate dashboard.',
    },
    {
      icon: <Briefcase size={24} />,
      title: 'Recruiter Job Management',
      description: 'Create, publish, edit, and manage comprehensive job openings to reach qualified professionals quickly.',
    },
    {
      icon: <Users size={24} />,
      title: 'Candidate Management',
      description: 'Review applicant resumes, assess candidate qualifications, and progress talent through hiring stages efficiently.',
    },
  ];

  return (
    <section id="features" className="section-container bg-surface-alt">
      <div className="section-header text-center">
        <span className="section-subtitle">Platform Capabilities</span>
        <h2 className="section-title">Everything You Need to Manage Talent</h2>
        <p className="section-description">
          Empowering candidates and talent acquisition teams with end-to-end management tools.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-icon-wrapper">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
