import { Briefcase, Users, Building2, CheckCircle2 } from 'lucide-react';

const StatisticsSection = () => {
  const stats = [
    {
      value: '10K+',
      label: 'Job Opportunities',
      description: 'Active openings across engineering, product, & management.',
      icon: <Briefcase size={24} />,
    },
    {
      value: '5K+',
      label: 'Registered Candidates',
      description: 'Active job seekers building professional career profiles.',
      icon: <Users size={24} />,
    },
    {
      value: '1K+',
      label: 'Recruiters',
      description: 'Enterprise talent acquisition professionals actively hiring.',
      icon: <Building2 size={24} />,
    },
    {
      value: '95%',
      label: 'Application Tracking Accuracy',
      description: 'Transparent updates throughout the talent acquisition workflow.',
      icon: <CheckCircle2 size={24} />,
    },
  ];

  return (
    <section className="section-container bg-surface-alt">
      <div className="section-header text-center">
        <span className="section-subtitle">Platform Metrics</span>
        <h2 className="section-title">Empowering Modern Recruitment at Scale</h2>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon-wrapper">{stat.icon}</div>
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-desc">{stat.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticsSection;
