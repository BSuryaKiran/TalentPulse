import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => (
  <section className="nexstep-cta-section">
    <div className="nexstep-cta-container text-center">
      <h2 className="nexstep-cta-title">
        Ready to Take the<br />
        <span className="nexstep-purple-gradient">Next Step?</span>
      </h2>
      <p className="nexstep-cta-subtitle">
        Whether you&apos;re searching for your next opportunity or the right candidate, TalentPulse simplifies the entire journey — from discovery to hire.
      </p>
      <Link to="/register" className="nexstep-btn-gradient-cta">
        <span>Create Free Account</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  </section>
);

export default CTASection;
