import { CheckCircle2, ShieldCheck } from 'lucide-react';

const BULLETS = [
  'Real-time application tracking & status updates',
  'Professional profile builder with skills & experience',
  'Smart job discovery and search & filter tools',
  'Recruiter pipeline management dashboard',
  'Role-based access control & security governance',
  'Scalable microservice backend architecture',
];

const WhyTalentPulse = () => (
  <section id="why-us" className="nexstep-why-section">
    <div className="nexstep-why-container">
      {/* Left: Feature Bullets */}
      <div>
        <h2 className="why-title">
          Why Choose <span className="nexstep-purple-gradient">TalentPulse?</span>
        </h2>
        <p className="why-subtitle">
          A unified, enterprise-grade platform purpose-built for modern talent acquisition — transparent for candidates, efficient for recruiters, and governable for administrators.
        </p>
        <ul className="why-bullet-list">
          {BULLETS.map((item, idx) => (
            <li key={idx} className="why-bullet-item">
              <CheckCircle2 size={18} className="why-check-icon" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Security Card */}
      <div className="why-right-card text-center">
        <div className="secure-shield-wrapper">
          <ShieldCheck size={44} />
        </div>
        <h3 className="secure-card-title">Secure & Reliable</h3>
        <p className="secure-card-desc">
          Your data is protected with industry-standard security measures. TalentPulse employs JWT authentication, BCrypt password hashing, and role-based authorization to ensure a secure experience for every user.
        </p>
        <div className="secure-badges-list">
          <span className="secure-pill-badge">JWT AUTH</span>
          <span className="secure-pill-badge">BCRYPT HASHING</span>
          <span className="secure-pill-badge">ROLE-BASED ACCESS</span>
          <span className="secure-pill-badge">MICROSERVICES</span>
        </div>
      </div>
    </div>
  </section>
);

export default WhyTalentPulse;
