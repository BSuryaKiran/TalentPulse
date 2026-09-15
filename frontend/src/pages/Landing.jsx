import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import RoleCards from '../components/landing/RoleCards';
import WhyTalentPulse from '../components/landing/WhyTalentPulse';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

const Landing = () => {
  return (
    <div className="nexstep-landing-wrapper">
      <LandingNavbar />
      <main>
        <HeroSection />
        <RoleCards />
        <WhyTalentPulse />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Landing;
