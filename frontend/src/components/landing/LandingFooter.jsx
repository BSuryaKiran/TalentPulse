import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const LandingFooter = () => (
  <footer className="nexstep-footer">
    <div className="nexstep-footer-container text-center">
      <Link to="/" className="nexstep-footer-logo">
        <div className="nexstep-footer-logo-icon">
          <Briefcase size={17} />
        </div>
        <span className="nexstep-footer-logo-text">TalentPulse</span>
      </Link>
      <p className="nexstep-footer-tagline">
        Empowering careers, one connection at a time.
      </p>
      <p className="nexstep-footer-copyright">
        &copy; 2026 TalentPulse. All rights reserved. &mdash; Enterprise Talent Acquisition &amp; Job Application Tracking Portal.
      </p>
    </div>
  </footer>
);

export default LandingFooter;
