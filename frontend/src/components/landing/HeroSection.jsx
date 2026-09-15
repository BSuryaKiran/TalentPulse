import { Link } from 'react-router-dom';
import { Users, Building2, Award, ArrowRight, Sparkles } from 'lucide-react';

const HERO_STATS = [
  { id: 'stat-jobs',       number: '10K+', label: 'Active Openings',  icon: <Award size={22} />,    cardClass: 'stat-card-indigo' },
  { id: 'stat-companies',  number: '500+', label: 'Partner Companies',icon: <Building2 size={22} />, cardClass: 'stat-card-cyan' },
  { id: 'stat-candidates', number: '5K+',  label: 'Registered Talent',icon: <Users size={22} />,    cardClass: 'stat-card-pink' },
];

const HeroSection = () => (
  <section id="hero" className="nexstep-hero-section">
    <div className="nexstep-hero-container text-center">
      <div className="nexstep-top-pill animate-fade-in">
        <Sparkles size={14} className="sparkle-icon" />
        <span>Enterprise Talent Acquisition Platform</span>
      </div>

      <h1 className="nexstep-hero-title">
        Connect <span className="nexstep-purple-gradient">Talent</span> With <br />
        <span className="nexstep-purple-gradient">Opportunity</span>
      </h1>

      <p className="nexstep-hero-subtitle">
        TalentPulse bridges the gap between candidates and recruiters. A centralized platform for job discovery, application tracking, and enterprise talent management.
      </p>

      <div className="nexstep-hero-buttons">
        <Link to="/register" className="nexstep-btn-gradient-primary">
          <span>Get Started Free</span>
          <ArrowRight size={16} />
        </Link>
        <Link to="/login" className="nexstep-btn-pill-secondary">
          Sign In
        </Link>
      </div>

      <div className="nexstep-stats-row">
        {HERO_STATS.map((stat) => (
          <div key={stat.id} className={`nexstep-stat-card ${stat.cardClass}`}>
            <div className="stat-card-icon-pill">{stat.icon}</div>
            <div className="stat-card-number">{stat.number}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
