import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const MainLayout = () => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            &copy; {new Date().getFullYear()} <strong>TalentPulse</strong> &mdash; Enterprise Talent Acquisition &amp; Job Application Tracking Portal.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
